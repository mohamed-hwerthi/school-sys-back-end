import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import {
  authenticateBiometric,
  getBiometricEnabled,
  isBiometricAvailable,
  setBiometricEnabled,
} from "@/utils/biometric";

/**
 * Manages the biometric-login user preference + device support flag.
 * Enabling requires a successful biometric prompt to confirm the device works.
 */
export function useBiometricSettings() {
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, e] = await Promise.all([isBiometricAvailable(), getBiometricEnabled()]);
      setAvailable(a);
      setEnabled(e);
      setLoading(false);
    })();
  }, []);

  const toggle = useCallback(async () => {
    if (enabled) {
      await setBiometricEnabled(false);
      setEnabled(false);
      return;
    }
    if (!available) {
      Alert.alert(
        "Indisponible",
        "Aucune méthode biométrique n'est configurée sur cet appareil (Face ID / empreinte).",
      );
      return;
    }
    const ok = await authenticateBiometric("Activer la connexion biométrique");
    if (ok) {
      await setBiometricEnabled(true);
      setEnabled(true);
    }
  }, [available, enabled]);

  return { available, enabled, loading, toggle };
}
