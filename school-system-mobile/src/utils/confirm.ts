import { Alert, Platform } from "react-native";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

/**
 * Cross-platform confirmation dialog. On web, React Native's `Alert.alert`
 * only shows the title via `window.alert`, ignoring buttons — so we use the
 * native `window.confirm` instead. On iOS/Android, falls back to `Alert.alert`
 * with full button support.
 */
export function confirmAction(opts: ConfirmOptions, onConfirm: () => void) {
  const { title, message, confirmLabel = "Confirmer", cancelLabel = "Annuler", destructive } = opts;

  if (Platform.OS === "web") {
    const text = message ? `${title}\n\n${message}` : title;
    if (typeof window !== "undefined" && window.confirm(text)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: cancelLabel, style: "cancel" },
    { text: confirmLabel, style: destructive ? "destructive" : "default", onPress: onConfirm },
  ]);
}
