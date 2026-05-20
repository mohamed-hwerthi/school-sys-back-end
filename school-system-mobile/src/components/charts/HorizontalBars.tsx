import { View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize } from "@/constants/theme";

interface BarItem {
  label: string;
  value: number;
  color?: string;
}

interface HorizontalBarsProps {
  data: BarItem[];
  /** Optional formatter for the value displayed on the right of each bar. */
  formatValue?: (v: number) => string;
}

/** Horizontal bar list — clean for categories with longer labels. */
export function HorizontalBars({ data, formatValue = String }: HorizontalBarsProps) {
  const { colors } = useTheme();
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={{ gap: spacing.sm }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const color = d.color ?? colors.primary;
        return (
          <View key={`${d.label}-${i}`}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontSize: fontSize.xs, color: colors.text, fontWeight: "600", flex: 1 }} numberOfLines={1}>
                {d.label}
              </Text>
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, fontWeight: "700", marginLeft: spacing.sm }}>
                {formatValue(d.value)}
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: colors.surfaceHover, borderRadius: 4, overflow: "hidden" }}>
              <View style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: 4 }} />
            </View>
          </View>
        );
      })}
    </View>
  );
}
