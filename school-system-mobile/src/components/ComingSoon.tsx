import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize } from "@/constants/theme";

interface ComingSoonProps {
  icon: string;
  title: string;
  subtitle?: string;
}

/**
 * Full-screen placeholder for a feature that is routed but not built yet.
 * Used by the teacher/director navigators until their screens land.
 */
export function ComingSoon({ icon, title, subtitle }: ComingSoonProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
        <Text style={{ fontSize: 56, marginBottom: spacing.md }}>{icon}</Text>
        <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.text, textAlign: "center" }}>
          {title}
        </Text>
        <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs, textAlign: "center" }}>
          {subtitle ?? "Cette fonctionnalité arrive bientôt."}
        </Text>
      </View>
    </SafeAreaView>
  );
}
