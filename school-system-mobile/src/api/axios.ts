import axios from "axios";
import { storage } from "@/utils/storage";
import { API_BASE_URL } from "@/constants/api";
import { emitForceLogout } from "@/api/authBus";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

// Request interceptor - add auth token + tenant header
api.interceptors.request.use(async (config) => {
  const token = await storage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Tenant will be set from user profile after login
  const tenantId = await storage.getItem("tenantId");
  if (tenantId) {
    config.headers["X-Tenant-ID"] = tenantId;
  }
  return config;
});

// Response interceptor - unwrap ApiResponse + handle 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse<T> wrapper
    const data = response.data;
    if (data && typeof data === "object" && "success" in data && "data" in data) {
      return data.data;
    }
    return data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        const newToken = res.data?.data?.accessToken || res.data?.accessToken;

        if (newToken) {
          await storage.setItem(TOKEN_KEY, newToken);
          if (res.data?.data?.refreshToken) {
            await storage.setItem(REFRESH_TOKEN_KEY, res.data.data.refreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        await storage.deleteItem(TOKEN_KEY);
        await storage.deleteItem(REFRESH_TOKEN_KEY);
        // Tell AuthContext to drop in-memory state too — otherwise the UI
        // stays on an authenticated screen with every query 401-ing.
        emitForceLogout();
      } finally {
        isRefreshing = false;
      }
    }

    // Extract error message
    const message = error.response?.data?.message || error.message || "Une erreur est survenue";
    return Promise.reject(new Error(message));
  }
);

export default api;
