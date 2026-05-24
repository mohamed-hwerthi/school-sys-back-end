import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";
import type { PendingCorrections } from "@/api/teacher.api";

interface Props {
  data: PendingCorrections | undefined;
  onPressDevoirs?: () => void;
  onPressQuiz?: () => void;
}

export function PendingCorrectionsCard({ data, onPressDevoirs, onPressQuiz }: Props) {
  const { colors } = useTheme();

  const devoirs = data?.devoirs ?? 0;
  const quiz = data?.quiz ?? 0;
  const total = devoirs + quiz;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: total > 0 ? colors.warning + "40" : colors.border,
        ...shadows.soft,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
        <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, flex: 1 }}>
          À corriger
        </Text>
        {total > 0 && (
          <View
            style={{
              minWidth: 24,
              height: 24,
              paddingHorizontal: 8,
              borderRadius: 12,
              backgroundColor: colors.warning,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: "#fff" }}>{total}</Text>
          </View>
        )}
      </View>

      {total === 0 ? (
        <Text
          style={{
            fontSize: fontSize.sm,
            color: colors.textMuted,
            textAlign: "center",
            paddingVertical: spacing.sm,
          }}
        >
          Aucune copie en attente 🎉
        </Text>
      ) : (
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <TouchableOpacity
            onPress={onPressDevoirs}
            disabled={!onPressDevoirs || devoirs === 0}
            activeOpacity={onPressDevoirs ? 0.7 : 1}
            style={{
              flex: 1,
              borderRadius: borderRadius.md,
              backgroundColor: colors.warning + "12",
              padding: spacing.md,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 22 }}>📝</Text>
            <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.warning, marginTop: 4 }}>
              {devoirs}
            </Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
              Devoir{devoirs > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressQuiz}
            disabled={!onPressQuiz || quiz === 0}
            activeOpacity={onPressQuiz ? 0.7 : 1}
            style={{
              flex: 1,
              borderRadius: borderRadius.md,
              backgroundColor: colors.info + "12",
              padding: spacing.md,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 22 }}>📚</Text>
            <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.info, marginTop: 4 }}>
              {quiz}
            </Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
              Quiz
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
