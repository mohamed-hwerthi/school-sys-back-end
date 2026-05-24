import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";
import type { StudentAtRisk } from "@/api/teacher.api";

interface Props {
  data: StudentAtRisk[] | undefined;
  onPressStudent?: (student: StudentAtRisk) => void;
}

function motifLabel(motif: string, valeur: number): { text: string; color: (c: any) => string } {
  if (motif === "moyenne_faible") {
    return {
      text: `Moyenne ${valeur.toFixed(1)}/20`,
      color: (c) => c.error,
    };
  }
  return {
    text: `${Math.round(valeur)} absences ce mois`,
    color: (c) => c.warning,
  };
}

export function StudentsAtRiskCard({ data, onPressStudent }: Props) {
  const { colors } = useTheme();

  if (!data) return null;

  return (
    <View
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
      <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginBottom: spacing.sm }}>
        Élèves à surveiller
      </Text>

      {data.length === 0 ? (
        <Text
          style={{
            fontSize: fontSize.sm,
            color: colors.textMuted,
            textAlign: "center",
            paddingVertical: spacing.md,
          }}
        >
          Tous vos élèves sont en bonne voie 👍
        </Text>
      ) : (
        data.map((s) => {
          const { text, color } = motifLabel(s.motif, s.valeur);
          const c = color(colors);
          return (
            <TouchableOpacity
              key={s.studentId}
              onPress={onPressStudent ? () => onPressStudent(s) : undefined}
              disabled={!onPressStudent}
              activeOpacity={onPressStudent ? 0.7 : 1}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: colors.border + "60",
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: c + "15",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: spacing.sm,
                }}
              >
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: c }}>
                  {(s.prenom?.[0] ?? "?")}
                  {(s.nom?.[0] ?? "")}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                  {s.prenom} {s.nom}
                </Text>
                <Text numberOfLines={1} style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 }}>
                  {s.classeNom}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                  borderRadius: borderRadius.sm,
                  backgroundColor: c + "15",
                }}
              >
                <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: c }}>{text}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}
