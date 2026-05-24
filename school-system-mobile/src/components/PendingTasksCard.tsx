import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";
import type { PendingTasks } from "@/api/teacher.api";

interface Props {
  data: PendingTasks | undefined;
  onPressAction?: () => void;
}

function frDate(iso: string): string {
  if (!iso) return "";
  const [, m, d] = iso.split("T")[0].split("-");
  return `${d}/${m}`;
}

export function PendingTasksCard({ data, onPressAction }: Props) {
  const { colors } = useTheme();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  if (total === 0) return null;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.error + "30",
        ...shadows.soft,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
        <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, flex: 1 }}>
          Saisies en retard
        </Text>
        <View
          style={{
            minWidth: 24,
            height: 24,
            paddingHorizontal: 8,
            borderRadius: 12,
            backgroundColor: colors.error,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: "#fff" }}>{total}</Text>
        </View>
      </View>

      {items.slice(0, 3).map((task, idx) => (
        <View
          key={`${task.kind}-${idx}`}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: spacing.xs,
          }}
        >
          <Text style={{ fontSize: 14, marginRight: spacing.sm }}>
            {task.kind === "NOTE" ? "📊" : "📋"}
          </Text>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
              {task.label}
            </Text>
            <Text numberOfLines={1} style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 }}>
              {task.classeNom ?? ""}
              {task.moduleNom ? ` · ${task.moduleNom}` : ""}
            </Text>
          </View>
          {task.date && (
            <Text style={{ fontSize: fontSize.xs, color: colors.error, fontWeight: "700" }}>
              {frDate(task.date)}
            </Text>
          )}
        </View>
      ))}

      {total > 3 && (
        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs }}>
          +{total - 3} autre{total - 3 > 1 ? "s" : ""}
        </Text>
      )}

      {onPressAction && (
        <TouchableOpacity
          onPress={onPressAction}
          activeOpacity={0.7}
          style={{
            marginTop: spacing.sm,
            backgroundColor: colors.error,
            borderRadius: borderRadius.md,
            paddingVertical: spacing.sm,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: "#fff" }}>
            Saisir maintenant
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
