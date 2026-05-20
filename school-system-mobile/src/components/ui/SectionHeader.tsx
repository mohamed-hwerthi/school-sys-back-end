import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize } from "@/constants/theme";

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md }}>
      <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{title}</Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.primary }}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
