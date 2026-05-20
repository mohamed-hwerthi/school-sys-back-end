import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { fontSize, borderRadius } from "@/constants/theme";

export interface SegmentOption {
  value: string;
  label: string;
  /** Tint used when the segment is selected (defaults to the primary colour). */
  color?: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/** Compact pill selector — used for the present/absent/late attendance toggle. */
export function SegmentedControl({ options, value, onChange, disabled }: SegmentedControlProps) {
  const { colors } = useTheme();
  return (
    <View style={{
      flexDirection: "row", backgroundColor: colors.surfaceHover,
      borderRadius: borderRadius.md, padding: 3, opacity: disabled ? 0.5 : 1,
    }}>
      {options.map((opt) => {
        const active = opt.value === value;
        const tint = opt.color ?? colors.primary;
        return (
          <TouchableOpacity
            key={opt.value}
            disabled={disabled}
            activeOpacity={0.7}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1, paddingVertical: 7, borderRadius: borderRadius.sm,
              backgroundColor: active ? tint : "transparent", alignItems: "center",
            }}
          >
            <Text style={{
              fontSize: fontSize.xs, fontWeight: "700",
              color: active ? "#fff" : colors.textSecondary,
            }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
