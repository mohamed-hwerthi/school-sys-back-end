import { type ReactNode } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, shadows } from "@/constants/theme";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Rounded card wrapping a chart, with a title. */
export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  const { colors } = useTheme();
  return (
    <View style={{
      backgroundColor: colors.background, borderRadius: 18, padding: spacing.md,
      marginBottom: spacing.md, ...shadows.soft,
    }}>
      <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: colors.text }}>{title}</Text>
      {subtitle ? (
        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>{subtitle}</Text>
      ) : null}
      <View style={{ marginTop: spacing.sm }}>{children}</View>
    </View>
  );
}
