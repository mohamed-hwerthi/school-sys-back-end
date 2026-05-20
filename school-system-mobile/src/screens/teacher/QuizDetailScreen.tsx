import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizzesApi } from "@/api/quizzes.api";
import { Badge } from "@/components/ui/Badge";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { quizStatutBadge } from "@/screens/teacher/QuizListScreen";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { TeacherMoreStackParamList } from "@/types/teacher";

type QuizDetailRoute = RouteProp<TeacherMoreStackParamList, "QuizDetail">;

export default function QuizDetailScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<QuizDetailRoute>();
  const queryClient = useQueryClient();

  const quizQ = useQuery({
    queryKey: ["quiz", "detail", params.quizId],
    queryFn: () => quizzesApi.getQuizDetail(params.quizId),
  });

  const publishMutation = useMutation({
    mutationFn: () => quizzesApi.publishQuiz(params.quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", "detail", params.quizId] });
      queryClient.invalidateQueries({ queryKey: ["quiz", "list"] });
      Alert.alert("Quiz publié", "Le quiz est désormais accessible aux élèves.");
    },
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec de la publication."),
  });

  if (quizQ.isLoading) return <DetailSkeleton cardCount={3} />;
  if (quizQ.isError || !quizQ.data) return <ErrorView onRetry={() => quizQ.refetch()} />;

  const quiz = quizQ.data;
  const b = quizStatutBadge(quiz.statut);
  const isDraft = (quiz.statut ?? "").toUpperCase() === "BROUILLON";
  const questions = [...quiz.questions].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
        {/* Info card */}
        <View style={{ backgroundColor: colors.background, borderRadius: 18, padding: spacing.md, ...shadows.soft }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.text, flex: 1 }}>{quiz.titre}</Text>
            <Badge label={b.label} color={b.color} bgColor={b.bg} />
          </View>
          {quiz.description ? (
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 6 }}>{quiz.description}</Text>
          ) : null}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.md }}>
            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>❓ {questions.length} question(s)</Text>
            {quiz.dureeMinutes != null && <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>⏱️ {quiz.dureeMinutes} min</Text>}
            {quiz.noteTotale != null && <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>🎯 /{quiz.noteTotale}</Text>}
          </View>
        </View>

        {/* Publish */}
        {isDraft && (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={publishMutation.isPending}
            onPress={() => publishMutation.mutate()}
            style={{
              marginTop: spacing.md, backgroundColor: colors.primary, borderRadius: 14,
              paddingVertical: 15, alignItems: "center", opacity: publishMutation.isPending ? 0.7 : 1,
            }}
          >
            {publishMutation.isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: "#fff", fontWeight: "800", fontSize: fontSize.md }}>Publier le quiz</Text>}
          </TouchableOpacity>
        )}

        {/* Questions */}
        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginTop: spacing.xl, marginBottom: spacing.sm }}>
          QUESTIONS
        </Text>
        {questions.length === 0 ? (
          <EmptyState icon="❓" title="Aucune question" subtitle="Ajoutez des questions depuis l'application web." />
        ) : (
          questions.map((q, idx) => (
            <View key={q.id} style={{ flexDirection: "row", backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, marginBottom: 10, ...shadows.soft }}>
              <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.primary, marginRight: spacing.md }}>{idx + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{q.texte}</Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                  {[q.typeQuestion, q.points != null ? `${q.points} pt` : null].filter(Boolean).join("  ·  ")}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
