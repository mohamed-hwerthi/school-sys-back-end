import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";
import type { OperationalAlerts } from "@/api/admin.api";

interface Props {
  data: OperationalAlerts | undefined;
  onPressImpayes?: () => void;
  onPressAbsentees?: () => void;
  onPressClasses?: () => void;
}

type Row = {
  key: string;
  icon: string;
  label: string;
  count: number;
  color: string;
  onPress?: () => void;
};

export function OperationalAlertsCard({
  data,
  onPressImpayes,
  onPressAbsentees,
  onPressClasses,
}: Props) {
  const { colors } = useTheme();

  if (!data) return null;

  const rows: Row[] = [];
  if (data.impayes30j > 0) {
    rows.push({
      key: "imp",
      icon: "💳",
      label: `Impayé${data.impayes30j > 1 ? "s" : ""} en retard > 30j`,
      count: data.impayes30j,
      color: colors.error,
      onPress: onPressImpayes,
    });
  }
  if (data.absenteesCeMois > 0) {
    rows.push({
      key: "abs",
      icon: "⚠️",
      label: `Élève${data.absenteesCeMois > 1 ? "s" : ""} avec absences répétées`,
      count: data.absenteesCeMois,
      color: colors.warning,
      onPress: onPressAbsentees,
    });
  }
  if (data.classesSansAffectation > 0) {
    rows.push({
      key: "cls",
      icon: "🏫",
      label: `Classe${data.classesSansAffectation > 1 ? "s" : ""} sans titulaire`,
      count: data.classesSansAffectation,
      color: colors.warning,
      onPress: onPressClasses,
    });
  }

  if (rows.length === 0) return null;

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
        Alertes opérationnelles
      </Text>

      {rows.map((r) => (
        <TouchableOpacity
          key={r.key}
          onPress={r.onPress}
          disabled={!r.onPress}
          activeOpacity={r.onPress ? 0.7 : 1}
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
              backgroundColor: r.color + "15",
              justifyContent: "center",
              alignItems: "center",
              marginRight: spacing.sm,
            }}
          >
            <Text style={{ fontSize: 16 }}>{r.icon}</Text>
          </View>
          <Text style={{ flex: 1, fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
            {r.label}
          </Text>
          <View
            style={{
              minWidth: 28,
              height: 28,
              paddingHorizontal: 8,
              borderRadius: 14,
              backgroundColor: r.color,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: "#fff" }}>{r.count}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
