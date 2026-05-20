import { View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  subtitle?: string;
}

export function StatCard({ icon, label, value, color, subtitle }: StatCardProps) {
  const { colors } = useTheme();
  return (
    <View style={{
      flex: 1, backgroundColor: colors.background, borderRadius: 18,
      padding: spacing.md, ...shadows.soft,
    }}>
      <View style={{
        width: 36, height: 36, borderRadius: borderRadius.md,
        backgroundColor: color + "15", justifyContent: "center", alignItems: "center", marginBottom: 8,
      }}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color }}>{value}</Text>
      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>{label}</Text>
      {subtitle && <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 1 }}>{subtitle}</Text>}
    </View>
  );
}
