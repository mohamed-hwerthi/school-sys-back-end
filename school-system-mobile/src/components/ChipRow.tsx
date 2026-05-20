import { ScrollView, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { fontSize, borderRadius } from "@/constants/theme";

export interface ChipItem {
  value: string;
  label: string;
}

interface ChipRowProps {
  items: ChipItem[];
  value: string | null;
  onChange: (value: string) => void;
}

/** Horizontal scrollable row of selectable chips. */
export function ChipRow({ items, value, onChange }: ChipRowProps) {
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onChange(item.value)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.full,
              backgroundColor: active ? colors.primary : colors.background,
              borderWidth: 1, borderColor: active ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: active ? "#fff" : colors.text }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
