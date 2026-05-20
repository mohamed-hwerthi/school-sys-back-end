import * as LocalAuthentication from "expo-local-authentication";
import { storage } from "@/utils/storage";

const ENABLED_KEY = "biometricEnabled";

/** True when the device has biometric hardware AND a credential is enrolled. */
export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const hardware = await LocalAuthentication.hasHardwareAsync();
    if (!hardware) return false;
    return await LocalAuthentication.isEnrolledAsync();
  } catch {
    return false;
  }
}

/** Prompts the system biometric dialog. Returns true on success. */
export async function authenticateBiometric(promptMessage: string): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: "Annuler",
      fallbackLabel: "Code",
      disableDeviceFallback: false,
    });
    return result.success;
  } catch {
    return false;
  }
}

/** Whether the user has opted into biometric login. */
export async function getBiometricEnabled(): Promise<boolean> {
  return (await storage.getItem(ENABLED_KEY)) === "true";
}

/** Toggles the user-level biometric login preference. */
export async function setBiometricEnabled(value: boolean): Promise<void> {
  if (value) await storage.setItem(ENABLED_KEY, "true");
  else await storage.deleteItem(ENABLED_KEY);
}
