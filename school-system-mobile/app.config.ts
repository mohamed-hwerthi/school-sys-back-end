import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "EcoleNet",
  slug: "ecolenet-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#7c3aed",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "dev.ecolenet.mobile",
    infoPlist: {
      NSFaceIDUsageDescription:
        "Utilisez Face ID pour vous connecter rapidement",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#7c3aed",
    },
    package: "dev.ecolenet.mobile",
    permissions: ["CAMERA", "READ_EXTERNAL_STORAGE"],
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-font",
    [
      "expo-local-authentication",
      {
        faceIDPermission:
          "Utilisez Face ID pour vous connecter rapidement",
      },
    ],
  ],
  scheme: "ecolenet",
  extra: {
    apiBaseUrl: process.env.API_BASE_URL || "http://10.0.2.2:8083/api",
    eas: {
      projectId: "your-eas-project-id",
    },
  },
  updates: {
    url: "https://u.expo.dev/your-eas-project-id",
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
});
