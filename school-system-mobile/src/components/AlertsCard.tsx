import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";
import type { AlertsPayload } from "@/api/parent-portal.api";

interface Props {
  data: AlertsPayload | undefined;
  onPressAbsences?: () => void;
  onPressDiscipline?: () => void;
}

type Alert = {
  key: string;
  icon: string;
  label: string;
  count: number;
  color: string;
  onPress?: () => void;
};

export function AlertsCard({ data, onPressAbsences, onPressDiscipline }: Props) {
  const { colors } = useTheme();

  if (!data) return null;

  const alerts: Alert[] = [];
  if (data.absencesNonJustifiees > 0) {
    alerts.push({
      key: "abs",
      icon: "⚠️",
      label: `Absence${data.absencesNonJustifiees > 1 ? "s" : ""} non justifiée${data.absencesNonJustifiees > 1 ? "s" : ""} (7j)`,
      count: data.absencesNonJustifiees,
      color: colors.error,
      onPress: onPressAbsences,
    });
  }
  if (data.retards > 2) {
    alerts.push({
      key: "ret",
      icon: "🕐",
      label: `Retard${data.retards > 1 ? "s" : ""} ce mois`,
      count: data.retards,
      color: colors.warning,
      onPress: onPressAbsences,
    });
  }
  if (data.incidentsRecents > 0) {
    alerts.push({
      key: "inc",
      icon: "🚨",
      label: `Incident${data.incidentsRecents > 1 ? "s" : ""} de discipline (30j)`,
      count: data.incidentsRecents,
      color: colors.error,
      onPress: onPressDiscipline,
    });
  }

  if (alerts.length === 0) return null;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.error + "40",
        ...shadows.soft,
      }}
    >
      <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginBottom: spacing.sm }}>
        Points d'attention
      </Text>

      {alerts.map((a) => (
        <TouchableOpacity
          key={a.key}
          onPress={a.onPress}
          disabled={!a.onPress}
          activeOpacity={a.onPress ? 0.7 : 1}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: spacing.sm,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: borderRadius.md,
              backgroundColor: a.color + "15",
              justifyContent: "center",
              alignItems: "center",
              marginRight: spacing.sm,
            }}
          >
            <Text style={{ fontSize: 16 }}>{a.icon}</Text>
          </View>
          <Text style={{ flex: 1, fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
            {a.label}
          </Text>
          <View
            style={{
              minWidth: 28,
              height: 28,
              paddingHorizontal: 8,
              borderRadius: 14,
              backgroundColor: a.color,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: "#fff" }}>{a.count}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
