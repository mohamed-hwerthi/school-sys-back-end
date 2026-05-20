import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigation, useRoute } from "@react-navigation/native";
import { quizApi } from "@/api/quiz.api";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface Question {
  id: number;
  texte: string;
  type: string; // QCM, TEXTE, VRAI_FAUX
  options: string[];
  ordre: number;
}

interface QuizDetail {
  id: number;
  titre: string;
  duree: number;
  questions: Question[];
}

interface SubmitResult {
  score: number;
  scoreMax: number;
  details: Array<{
    questionId: number;
    correct: boolean;
    bonneReponse: string;
  }>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function QuizPassationScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const quizId = route.params?.quizId as number;
  const eleveId = route.params?.eleveId as number;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [tentativeId, setTentativeId] = useState<number | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch quiz detail
  const {
    data: quiz,
    isLoading: quizLoading,
    isError: quizError,
  } = useQuery({
    queryKey: ["quizPassation", quizId],
    queryFn: () => quizApi.getDetail(quizId) as Promise<QuizDetail>,
    enabled: !!quizId,
  });

  // Start attempt mutation
  const startMutation = useMutation({
    mutationFn: () => quizApi.startAttempt({ quizId, eleveId }),
    onSuccess: (data: any) => {
      setTentativeId(data?.id || data);
    },
    onError: () => {
      Alert.alert("Erreur", "Impossible de demarrer le quiz. Veuillez reessayer.");
    },
  });

  // Submit answers mutation
  const submitMutation = useMutation({
    mutationFn: (data: { tentativeId: number; reponses: any[] }) =>
      quizApi.submitAnswers(data),
    onSuccess: (data: SubmitResult) => {
      setResult(data);
      setIsSubmitting(false);
      if (timerRef.current) clearInterval(timerRef.current);
    },
    onError: () => {
      setIsSubmitting(false);
      Alert.alert("Erreur", "Impossible de soumettre les reponses. Veuillez reessayer.");
    },
  });

  // Initialize timer and start attempt when quiz loads
  useEffect(() => {
    if (quiz && !tentativeId && !startMutation.isPending) {
      setTimeLeft((quiz.duree || 30) * 60);
      startMutation.mutate();
    }
  }, [quiz]);

  // Timer countdown
  useEffect(() => {
    if (tentativeId && timeLeft > 0 && !result) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - auto submit
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tentativeId, result]);

  const questions: Question[] = quiz?.questions || [];
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const setAnswer = useCallback(
    (questionId: number, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (autoSubmit = false) => {
      if (isSubmitting || !tentativeId) return;

      const doSubmit = () => {
        setIsSubmitting(true);
        const reponses = questions.map((q) => ({
          questionId: q.id,
          reponse: answers[q.id] || "",
        }));
        submitMutation.mutate({ tentativeId, reponses });
      };

      if (autoSubmit) {
        doSubmit();
      } else {
        const unanswered = questions.filter((q) => !answers[q.id]);
        const message =
          unanswered.length > 0
            ? `Vous avez ${unanswered.length} question${unanswered.length > 1 ? "s" : ""} sans reponse. Voulez-vous soumettre quand meme ?`
            : "Etes-vous sur de vouloir soumettre vos reponses ?";

        Alert.alert("Soumettre le quiz", message, [
          { text: "Annuler", style: "cancel" },
          { text: "Soumettre", onPress: doSubmit },
        ]);
      }
    },
    [isSubmitting, tentativeId, questions, answers, submitMutation]
  );

  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Loading state
  if (quizLoading || startMutation.isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.md }}>
          Chargement du quiz...
        </Text>
      </View>
    );
  }

  // Error state
  if (quizError || !quiz) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl,
            paddingBottom: spacing.md,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 36, height: 36, borderRadius: 12,
              backgroundColor: colors.surface, justifyContent: "center", alignItems: "center",
            }}
          >
            <Text style={{ fontSize: fontSize.md, color: colors.text }}>←</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: "center", padding: spacing.lg }}>
          <EmptyState icon="📝" title="Quiz introuvable" subtitle="Impossible de charger le quiz." />
        </View>
      </View>
    );
  }

  // Results screen
  if (result) {
    const scorePercent = result.scoreMax > 0 ? Math.round((result.score / result.scoreMax) * 100) : 0;
    const scoreColor = scorePercent >= 80 ? colors.success : scorePercent >= 50 ? colors.warning : colors.error;
    const correctCount = result.details?.filter((d) => d.correct).length || 0;
    const wrongCount = (result.details?.length || 0) - correctCount;

    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
        >
          {/* Result header */}
          <View style={{ alignItems: "center", marginTop: spacing.xl, marginBottom: spacing.xl }}>
            <Text style={{ fontSize: 56, marginBottom: spacing.md }}>
              {scorePercent >= 80 ? "🎉" : scorePercent >= 50 ? "👍" : "📚"}
            </Text>
            <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text, marginBottom: spacing.xs }}>
              Quiz termine !
            </Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              {quiz.titre}
            </Text>
          </View>

          {/* Score card */}
          <View
            style={{
              backgroundColor: scoreColor + "10",
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
              alignItems: "center",
              marginBottom: spacing.lg,
              borderWidth: 2,
              borderColor: scoreColor + "30",
            }}
          >
            <Text style={{ fontSize: 48, fontWeight: "900", color: scoreColor }}>
              {result.score}/{result.scoreMax}
            </Text>
            <Text style={{ fontSize: fontSize.xl, fontWeight: "700", color: scoreColor, marginTop: spacing.xs }}>
              {scorePercent}%
            </Text>

            {/* Progress bar */}
            <View
              style={{
                width: "100%",
                height: 8,
                backgroundColor: scoreColor + "20",
                borderRadius: 4,
                overflow: "hidden",
                marginTop: spacing.md,
              }}
            >
              <View
                style={{
                  height: 8,
                  width: `${scorePercent}%`,
                  backgroundColor: scoreColor,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>

          {/* Breakdown */}
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              marginBottom: spacing.lg,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.success + "10",
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.success + "20",
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: spacing.xs }}>✅</Text>
              <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.success }}>
                {correctCount}
              </Text>
              <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Correctes</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.error + "10",
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.error + "20",
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: spacing.xs }}>❌</Text>
              <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.error }}>
                {wrongCount}
              </Text>
              <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Incorrectes</Text>
            </View>
          </View>

          {/* Detail per question */}
          {result.details && result.details.length > 0 && (
            <View style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  fontSize: fontSize.xs,
                  fontWeight: "600",
                  color: colors.textMuted,
                  marginBottom: spacing.sm,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Detail des reponses
              </Text>
              {result.details.map((detail, idx) => (
                <View
                  key={detail.questionId || idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.xs,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderLeftWidth: 3,
                    borderLeftColor: detail.correct ? colors.success : colors.error,
                  }}
                >
                  <Text style={{ fontSize: 16, marginRight: spacing.sm }}>
                    {detail.correct ? "✅" : "❌"}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                      Question {idx + 1}
                    </Text>
                    {!detail.correct && detail.bonneReponse && (
                      <Text style={{ fontSize: fontSize.xs, color: colors.success, marginTop: 2 }}>
                        Reponse correcte : {detail.bonneReponse}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.lg,
              paddingVertical: spacing.md + 4,
              alignItems: "center",
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: "#fff" }}>
              Retour aux quiz
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Quiz passation
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Timer + progress header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        {/* Timer row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.md,
          }}
        >
          <View>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary }}>
              Question {currentIndex + 1}/{totalQuestions}
            </Text>
            <Text
              style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}
              numberOfLines={1}
            >
              {quiz.titre}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: timeLeft < 60 ? colors.error + "15" : colors.surface,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: timeLeft < 60 ? colors.error + "30" : colors.border,
            }}
          >
            <Text style={{ fontSize: 14, marginRight: 4 }}>⏱️</Text>
            <Text
              style={{
                fontSize: fontSize.md,
                fontWeight: "800",
                color: timeLeft < 60 ? colors.error : colors.text,
                fontVariant: ["tabular-nums"],
              }}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View
          style={{
            height: 4,
            backgroundColor: colors.border,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 4,
              width: `${progress}%`,
              backgroundColor: colors.primary,
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      {/* Question content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
      >
        {currentQuestion ? (
          <>
            {/* Question text */}
            <Text
              style={{
                fontSize: fontSize.xl,
                fontWeight: "700",
                color: colors.text,
                marginBottom: spacing.lg,
                lineHeight: 28,
              }}
            >
              {currentQuestion.texte}
            </Text>

            {/* Answer options */}
            {(currentQuestion.type === "QCM" || currentQuestion.type === "VRAI_FAUX") &&
            currentQuestion.options?.length > 0 ? (
              currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setAnswer(currentQuestion.id, option)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: isSelected ? colors.primary + "10" : colors.surface,
                      borderRadius: borderRadius.lg,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                      borderWidth: 2,
                      borderColor: isSelected ? colors.primary : colors.border,
                    }}
                  >
                    {/* Radio button */}
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: isSelected ? colors.primary : colors.textMuted,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: spacing.md,
                      }}
                    >
                      {isSelected && (
                        <View
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: colors.primary,
                          }}
                        />
                      )}
                    </View>

                    <Text
                      style={{
                        fontSize: fontSize.md,
                        fontWeight: isSelected ? "700" : "500",
                        color: isSelected ? colors.primary : colors.text,
                        flex: 1,
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              // Text input for open-ended questions
              <TextInput
                value={answers[currentQuestion.id] || ""}
                onChangeText={(text) => setAnswer(currentQuestion.id, text)}
                placeholder="Saisissez votre reponse..."
                placeholderTextColor={colors.textMuted}
                multiline
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontSize: fontSize.md,
                  color: colors.text,
                  minHeight: 120,
                  textAlignVertical: "top",
                }}
              />
            )}
          </>
        ) : (
          <EmptyState icon="📝" title="Aucune question" subtitle="Ce quiz ne contient aucune question." />
        )}
      </ScrollView>

      {/* Bottom navigation */}
      {currentQuestion && (
        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          {/* Previous button */}
          <TouchableOpacity
            onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.lg,
              backgroundColor: colors.surface,
              alignItems: "center",
              opacity: currentIndex === 0 ? 0.4 : 1,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
              Precedent
            </Text>
          </TouchableOpacity>

          {/* Next / Submit button */}
          {isLastQuestion ? (
            <TouchableOpacity
              onPress={() => handleSubmit(false)}
              disabled={isSubmitting}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.success,
                alignItems: "center",
                opacity: isSubmitting ? 0.6 : 1,
              }}
              activeOpacity={0.7}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: "#fff" }}>
                  Soumettre
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.primary,
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: "#fff" }}>
                Suivant
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
