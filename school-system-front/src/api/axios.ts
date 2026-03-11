import axios from "axios";
import env from "@/config/env";

const api = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach tenant + auth token
api.interceptors.request.use((config) => {
  // Multi-tenant header
  if (env.TENANT_ID) {
    config.headers["X-Tenant-ID"] = env.TENANT_ID;
  }

  // Auth token
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — unwrap ApiResponse { success, message, data }
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === "object" && "success" in body) {
      if (!body.success) {
        return Promise.reject(new Error(body.message || "Erreur serveur"));
      }
      // Unwrap: callers get .data directly
      response.data = body.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    // Extract backend error message if available
    const msg = error.response?.data?.message || error.message;
    return Promise.reject(new Error(msg));
  }
);

export default api;
