import api from "./axios";
import type { LoginRequest, LoginResponse, AuthUser, RefreshTokenRequest } from "@/types/auth";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/refresh-token", data);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post("/auth/logout", { refreshToken });
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await api.get<AuthUser>("/auth/me");
    return response.data;
  },
};
