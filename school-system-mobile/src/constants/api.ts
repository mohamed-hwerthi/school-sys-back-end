import Constants from "expo-constants";

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ?? "http://10.0.2.2:8080/api";
