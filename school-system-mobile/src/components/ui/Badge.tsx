import { View, Text } from "react-native";
import { fontSize, borderRadius } from "@/constants/theme";

interface BadgeProps {
  label: string;
  color: string;
  bgColor: string;
}

export function Badge({ label, color, bgColor }: BadgeProps) {
  return (
    <View style={{ backgroundColor: bgColor, borderRadius: borderRadius.full, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color }}>{label}</Text>
    </View>
  );
}
