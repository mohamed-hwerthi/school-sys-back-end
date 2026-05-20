import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius } from "@/constants/theme";

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({ message = "Une erreur est survenue", onRetry }: ErrorViewProps) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl, backgroundColor: colors.surface }}>
      <Text style={{ fontSize: 48, marginBottom: spacing.md }}>⚠️</Text>
      <Text style={{ fontSize: fontSize.md, fontWeight: "600", color: colors.text, textAlign: "center" }}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{ marginTop: spacing.lg, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: borderRadius.md }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: fontSize.sm }}>Reessayer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
