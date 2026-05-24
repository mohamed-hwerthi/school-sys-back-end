import { Platform } from "react-native";
import Constants from "expo-constants";

const DEFAULT_URL = Platform.select({
  android: "http://10.0.2.2:8083/api",
  ios: "http://localhost:8083/api",
  default: "http://localhost:8083/api", // web
});

// app.config's `extra.apiBaseUrl` is global (not platform-aware), so it must
// not override the per-platform default on web/iOS where 10.0.2.2 is unreachable.
const configuredUrl = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;
export const API_BASE_URL =
  Platform.OS === "web" ? DEFAULT_URL : (configuredUrl ?? DEFAULT_URL);
