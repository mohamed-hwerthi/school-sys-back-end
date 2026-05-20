import api from "./axios";
import type { LoginRequest, LoginResponse, MeResponse, Session } from "@/types/auth";

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    api.post("/auth/login", data),

  refreshToken: (refreshToken: string): Promise<LoginResponse> =>
    api.post("/auth/refresh-token", { refreshToken }),

  logout: (refreshToken: string): Promise<void> =>
    api.post("/auth/logout", { refreshToken }),

  getMe: (): Promise<MeResponse> =>
    api.get("/auth/me"),

  verify2FA: (data: { userId: number; code: string }): Promise<LoginResponse> =>
    api.post("/auth/2fa/verify", data),

  forgotPassword: (email: string): Promise<string> =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, newPassword: string): Promise<string> =>
    api.post("/auth/reset-password", { token, newPassword }),

  /** Active sessions of the current user. */
  getSessions: (): Promise<Session[]> =>
    api.get("/auth/sessions"),

  /** Revokes a single session by id. */
  revokeSession: (sessionId: string): Promise<void> =>
    api.delete(`/auth/sessions/${sessionId}`),

  /** Revokes all sessions except the current one. */
  revokeOtherSessions: (): Promise<void> =>
    api.delete("/auth/sessions"),
};
