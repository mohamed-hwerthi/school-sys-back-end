import { Fragment } from "react";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { colors } from "@/constants/theme";

export interface BarDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  width: number;
  height?: number;
  color?: string;
}

/** Lightweight vertical bar chart drawn with react-native-svg (clean on web & native). */
export function BarChart({ data, width, height = 190, color = colors.primary }: BarChartProps) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);
  const padTop = 20;
  const padBottom = 28;
  const chartH = height - padTop - padBottom;
  const slot = width / data.length;
  const barW = Math.min(slot * 0.5, 42);

  return (
    <Svg width={width} height={height}>
      {data.map((d, i) => {
        const h = Math.max((d.value / max) * chartH, 3);
        const x = i * slot + (slot - barW) / 2;
        const y = padTop + (chartH - h);
        return (
          <Fragment key={i}>
            <Rect x={x} y={y} width={barW} height={h} rx={6} fill={color} />
            <SvgText
              x={x + barW / 2}
              y={y - 6}
              fontSize={11}
              fontWeight="700"
              fill={colors.textSecondary}
              textAnchor="middle"
            >
              {String(d.value)}
            </SvgText>
            <SvgText
              x={x + barW / 2}
              y={height - 9}
              fontSize={10}
              fill={colors.textMuted}
              textAnchor="middle"
            >
              {d.label}
            </SvgText>
          </Fragment>
        );
      })}
    </Svg>
  );
}
