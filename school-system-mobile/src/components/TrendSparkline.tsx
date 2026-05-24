import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";
import type { TrendPayload } from "@/api/parent-portal.api";

interface Props {
  data: TrendPayload | undefined;
  onPress?: () => void;
}

/**
 * Mini barres horizontales pour les 3 trimestres + tendance globale.
 * Pas de lib externe — pure View/Text pour rester léger sur web.
 */
export function TrendSparkline({ data, onPress }: Props) {
  const { colors } = useTheme();
  const points = data?.points ?? [];

  const validPoints = points.filter((p) => p.noteCount > 0);
  const hasData = validPoints.length > 0;

  const last = validPoints[validPoints.length - 1];
  const prev = validPoints[validPoints.length - 2];
  let trendColor = colors.textMuted;
  let trendIcon = "—";
  if (last && prev) {
    if (last.moyenne > prev.moyenne + 0.2) {
      trendColor = colors.success;
      trendIcon = "↗";
    } else if (last.moyenne < prev.moyenne - 0.2) {
      trendColor = colors.error;
      trendIcon = "↘";
    } else {
      trendColor = colors.warning;
      trendIcon = "→";
    }
  }

  const maxScale = 20;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.soft,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
        <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, flex: 1 }}>
          Évolution de la moyenne
        </Text>
        <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: trendColor }}>{trendIcon}</Text>
      </View>

      {!hasData ? (
        <Text
          style={{
            fontSize: fontSize.sm,
            color: colors.textMuted,
            textAlign: "center",
            paddingVertical: spacing.md,
          }}
        >
          Pas encore de notes saisies cette année
        </Text>
      ) : (
        <View style={{ marginTop: spacing.xs }}>
          {points.map((p) => {
            const empty = p.noteCount === 0;
            const ratio = empty ? 0 : Math.min(p.moyenne / maxScale, 1);
            const barColor =
              empty ? colors.border :
              p.moyenne >= 14 ? colors.success :
              p.moyenne >= 10 ? colors.warning :
              colors.error;
            return (
              <View
                key={p.trimestre}
                style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}
              >
                <Text style={{ width: 44, fontSize: fontSize.xs, color: colors.textSecondary }}>
                  T{p.trimestre}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 10,
                    backgroundColor: colors.border + "40",
                    borderRadius: 5,
                    overflow: "hidden",
                    marginHorizontal: spacing.sm,
                  }}
                >
                  <View
                    style={{
                      width: `${ratio * 100}%`,
                      height: "100%",
                      backgroundColor: barColor,
                      borderRadius: 5,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: 56,
                    textAlign: "right",
                    fontSize: fontSize.sm,
                    fontWeight: "700",
                    color: empty ? colors.textMuted : barColor,
                  }}
                >
                  {empty ? "—" : p.moyenne.toFixed(1)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </TouchableOpacity>
  );
}
