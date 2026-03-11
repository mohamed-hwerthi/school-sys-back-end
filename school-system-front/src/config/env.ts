const env = {
  // App
  APP_NAME: import.meta.env.VITE_APP_NAME as string,
  APP_VERSION: import.meta.env.VITE_APP_VERSION as string,
  APP_ENV: import.meta.env.VITE_APP_ENV as string,

  // API
  API_URL: import.meta.env.VITE_API_URL as string,
  TENANT_ID: import.meta.env.VITE_TENANT_ID as string,

  // Feature flags
  ENABLE_MOCK: import.meta.env.VITE_ENABLE_MOCK === "true",
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL as string,

  // Helpers
  isDev: import.meta.env.VITE_APP_ENV === "development",
  isProd: import.meta.env.VITE_APP_ENV === "production",
} as const;

export default env;
