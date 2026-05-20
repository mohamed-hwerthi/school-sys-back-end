import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useRoute } from "@react-navigation/native";
import { quizApi } from "@/api/quiz.api";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface Attempt {
  id: number;
  score: number;
  scoreMax: number;
  dateDebut: string;
  dateFin: string;
  statut: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getScoreColor(score: number, max: number): string {
  if (max === 0) return colors.textMuted;
  const pct = (score / max) * 100;
  if (pct >= 80) return colors.success;
  if (pct >= 50) return colors.warning;
  return colors.error;
}

export default function QuizDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const quizId = route.params?.quizId as number;
  const eleveId = route.params?.eleveId as number;

  const {
    data: quiz,
    isLoading: quizLoading,
    isError: quizError,
  } = useQuery({
    queryKey: ["quizDetail", quizId],
    queryFn: () => quizApi.getDetail(quizId),
    enabled: !!quizId,
  });

  const {
    data: attempts = [],
    isLoading: attemptsLoading,
  } = useQuery({
    queryKey: ["quizAttempts", eleveId],
    queryFn: () => quizApi.getAttempts(eleveId),
    enabled: !!eleveId,
  });

  // Filter attempts for this quiz
  const quizAttempts = attempts.filter(
    (a: Attempt & { quizId?: number }) => a.quizId === quizId
  );

  const maxTentatives = quiz?.maxTentatives || 0;
  const attemptsRemaining = maxTentatives > 0 ? maxTentatives - quizAttempts.length : -1;
  const canStart = attemptsRemaining !== 0;

  const isLoading = quizLoading || attemptsLoading;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "center",
            marginRight: spacing.md,
          }}
        >
          <Text style={{ fontSize: fontSize.md, color: colors.text }}>←</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: fontSize.lg,
            fontWeight: "700",
            color: colors.text,
            flex: 1,
          }}
          numberOfLines={1}
        >
          Detail du quiz
        </Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : quizError || !quiz ? (
        <View style={{ flex: 1, justifyContent: "center", padding: spacing.lg }}>
          <EmptyState
            icon="📝"
            title="Quiz introuvable"
            subtitle="Ce quiz n'existe pas ou a ete supprime."
          />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
        >
          {/* Quiz info card */}
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.xl,
              padding: spacing.lg,
              marginBottom: spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: fontSize.xxl,
                fontWeight: "800",
                color: "#fff",
                marginBottom: spacing.sm,
              }}
            >
              {quiz.titre}
            </Text>

            {quiz.module && (
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: borderRadius.full,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  alignSelf: "flex-start",
                  marginBottom: spacing.md,
                }}
              >
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: "#fff" }}>
                  {quiz.module}
                </Text>
              </View>
            )}

            {quiz.description && (
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 20,
                  marginBottom: spacing.md,
                }}
              >
                {quiz.description}
              </Text>
            )}

            {/* Stats row */}
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                paddingTop: spacing.md,
                borderTopWidth: 1,
                borderTopColor: "rgba(255,255,255,0.15)",
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: "#fff" }}>
                  {quiz.nbQuestions || "?"}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: "rgba(255,255,255,0.6)" }}>
                  Questions
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: "#fff" }}>
                  {quiz.duree || "?"}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: "rgba(255,255,255,0.6)" }}>
                  Minutes
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: "#fff" }}>
                  {maxTentatives > 0 ? maxTentatives : "∞"}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: "rgba(255,255,255,0.6)" }}>
                  Essais max
                </Text>
              </View>
            </View>
          </View>

          {/* Previous attempts */}
          {quizAttempts.length > 0 && (
            <View style={{ marginBottom: spacing.lg }}>
              <SectionHeader title="Tentatives precedentes" />

              {quizAttempts.map((attempt: Attempt, index: number) => {
                const scoreColor = getScoreColor(attempt.score || 0, attempt.scoreMax || 1);
                return (
                  <View
                    key={attempt.id || index}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: borderRadius.lg,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                      borderWidth: 1,
                      borderColor: colors.border,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* Attempt number */}
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        backgroundColor: colors.primary + "15",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: spacing.md,
                      }}
                    >
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: colors.primary }}>
                        #{index + 1}
                      </Text>
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
                        {formatDate(attempt.dateFin || attempt.dateDebut)}
                      </Text>
                      {attempt.statut && (
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                          {attempt.statut === "TERMINE" ? "Termine" : attempt.statut}
                        </Text>
                      )}
                    </View>

                    {/* Score */}
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: scoreColor }}>
                        {attempt.score ?? "--"}/{attempt.scoreMax ?? "--"}
                      </Text>
                      <Badge
                        label={
                          attempt.scoreMax
                            ? `${Math.round(((attempt.score || 0) / attempt.scoreMax) * 100)}%`
                            : "--"
                        }
                        color={scoreColor}
                        bgColor={scoreColor + "15"}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Remaining attempts info */}
          {maxTentatives > 0 && (
            <View
              style={{
                backgroundColor: colors.info + "10",
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.lg,
                borderWidth: 1,
                borderColor: colors.info + "20",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, marginRight: spacing.sm }}>ℹ️</Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.info, fontWeight: "600", flex: 1 }}>
                {attemptsRemaining > 0
                  ? `Il vous reste ${attemptsRemaining} tentative${attemptsRemaining > 1 ? "s" : ""}`
                  : "Vous avez utilise toutes vos tentatives"}
              </Text>
            </View>
          )}

          {/* Start button */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("QuizPassation", {
                quizId: quiz.id,
                eleveId,
              })
            }
            disabled={!canStart}
            style={{
              backgroundColor: canStart ? colors.primary : colors.textMuted,
              borderRadius: borderRadius.lg,
              paddingVertical: spacing.md + 4,
              alignItems: "center",
              opacity: canStart ? 1 : 0.5,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: "#fff" }}>
              {canStart ? "Commencer le quiz" : "Aucune tentative restante"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
