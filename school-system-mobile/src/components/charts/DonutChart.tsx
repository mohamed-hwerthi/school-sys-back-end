import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { colors, fontSize } from "@/constants/theme";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  centerValue?: string;
  centerLabel?: string;
}

/** Donut/ring chart drawn with react-native-svg. Renders identically on web and native. */
export function DonutChart({ segments, size = 160, centerValue, centerLabel }: DonutChartProps) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const strokeW = size * 0.16;
  const r = (size - strokeW) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  let offset = 0;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <G rotation={-90} origin={`${cx}, ${cy}`}>
          <Circle cx={cx} cy={cy} r={r} stroke={colors.surfaceHover} strokeWidth={strokeW} fill="none" />
          {total > 0 &&
            segments.map((seg, i) => {
              const len = (seg.value / total) * circ;
              const node = (
                <Circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  stroke={seg.color}
                  strokeWidth={strokeW}
                  fill="none"
                  strokeDasharray={`${len} ${circ - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return node;
            })}
        </G>
      </Svg>
      <View style={{ alignItems: "center" }}>
        {centerValue ? (
          <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.text }}>{centerValue}</Text>
        ) : null}
        {centerLabel ? (
          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>{centerLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}
