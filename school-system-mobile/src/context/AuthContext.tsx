import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { storage } from "@/utils/storage";
import { authApi } from "@/api/auth.api";
import { onForceLogout } from "@/api/authBus";
import type { AuthUser, LoginRequest, LoginResponse } from "@/types/auth";

interface TwoFactorPending {
  userId: number;
}

interface AuthContextType {
  user: AuthUser | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  twoFactorPending: TwoFactorPending | null;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  loginWithBiometric: () => Promise<void>;
  verify2FA: (userId: number, code: string) => Promise<void>;
  cancelTwoFactor: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [twoFactorPending, setTwoFactorPending] = useState<TwoFactorPending | null>(null);

  const isAuthenticated = !!user;

  const clearAuth = useCallback(async () => {
    await storage.deleteItem(TOKEN_KEY);
    await storage.deleteItem(REFRESH_TOKEN_KEY);
    await storage.deleteItem(USER_KEY);
    await storage.deleteItem("tenantId");
    setUser(null);
    setPermissions([]);
    setTwoFactorPending(null);
    // Drop the persisted React Query cache so the next login starts clean.
    queryClient.clear();
  }, [queryClient]);

  // The axios interceptor signals a forced logout when token refresh fails.
  useEffect(() => onForceLogout(() => { void clearAuth(); }), [clearAuth]);

  /** Loads the canonical user + permissions from GET /auth/me. */
  const applyMe = useCallback(async () => {
    const me = await authApi.getMe();
    setUser(me.user);
    setPermissions(me.permissions ?? []);
    await storage.setItem(USER_KEY, JSON.stringify(me.user));
    if (me.user.tenantId) {
      await storage.setItem("tenantId", me.user.tenantId);
    }
  }, []);

  // Verify token on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await storage.getItem(TOKEN_KEY);
        if (!token) { setIsLoading(false); return; }
        await applyMe();
      } catch {
        await clearAuth();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [applyMe, clearAuth]);

  const storeTokens = useCallback(async (response: LoginResponse) => {
    await storage.setItem(TOKEN_KEY, response.accessToken);
    await storage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    await storage.setItem(USER_KEY, JSON.stringify(response.user));
    if (response.user.tenantId) {
      await storage.setItem("tenantId", response.user.tenantId);
    }
    // Show the app immediately from the login payload…
    setUser(response.user);
    setTwoFactorPending(null);
    // …then enrich with permissions / canonical user from /auth/me.
    try {
      await applyMe();
    } catch {
      /* keep the login-payload user; permissions stay empty */
    }
  }, [applyMe]);

  const login = useCallback(async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.login(data);
    if (response.twoFactorRequired && response.twoFactorUserId) {
      setTwoFactorPending({ userId: response.twoFactorUserId });
      return response;
    }
    await storeTokens(response);
    return response;
  }, [storeTokens]);

  const verify2FA = useCallback(async (userId: number, code: string) => {
    const response = await authApi.verify2FA({ userId, code });
    await storeTokens(response);
  }, [storeTokens]);

  /** Refreshes tokens with the stored refresh token — gated by the caller (biometric). */
  const loginWithBiometric = useCallback(async () => {
    const refreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error("Aucune session enregistrée — connectez-vous d'abord avec votre mot de passe.");
    const response = await authApi.refreshToken(refreshToken);
    await storeTokens(response);
  }, [storeTokens]);

  const cancelTwoFactor = useCallback(() => {
    setTwoFactorPending(null);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try { await authApi.logout(refreshToken); } catch { /* ignore */ }
    }
    await clearAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider value={{
      user, permissions, isAuthenticated, isLoading, twoFactorPending,
      login, loginWithBiometric, verify2FA, cancelTwoFactor, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Returns true when the current user holds the given backend permission. */
export function useHasPermission(permission: string): boolean {
  return useAuth().permissions.includes(permission);
}
