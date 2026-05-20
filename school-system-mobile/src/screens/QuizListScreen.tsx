import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useCallback } from "react";
import { useChild } from "@/context/ChildContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { quizApi } from "@/api/quiz.api";
import { ChildSelector } from "@/components/ChildSelector";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface Quiz {
  id: number;
  titre: string;
  description: string;
  module: string;
  duree: number;
  nbQuestions: number;
  statut: string;
  maxTentatives: number;
  createdAt: string;
}

function getStatusBadge(statut: string): { label: string; color: string; bgColor: string } {
  const s = statut?.toUpperCase();
  if (s === "PUBLIE" || s === "PUBLISHED") return { label: "Publie", color: colors.success, bgColor: colors.success + "15" };
  if (s === "BROUILLON" || s === "DRAFT") return { label: "Brouillon", color: colors.textMuted, bgColor: colors.textMuted + "15" };
  if (s === "FERME" || s === "CLOSED") return { label: "Ferme", color: colors.error, bgColor: colors.error + "15" };
  return { label: statut || "Inconnu", color: colors.info, bgColor: colors.info + "15" };
}

function isPublished(statut: string): boolean {
  const s = statut?.toUpperCase();
  return s === "PUBLIE" || s === "PUBLISHED";
}

export default function QuizListScreen() {
  const { colors } = useTheme();
  const { selectedChild, isLoading: childrenLoading } = useChild();
  const navigation = useNavigation<any>();

  const {
    data: quizzes = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["quizzes", selectedChild?.classeId],
    queryFn: () => quizApi.getByClasse(selectedChild!.classeId),
    enabled: !!selectedChild?.classeId,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Only show published quizzes to students/parents
  const visibleQuizzes = quizzes.filter((q: Quiz) => isPublished(q.statut));

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
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text }}>
            Quiz
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
            Quiz en ligne disponibles
          </Text>
        </View>
        <Text style={{ fontSize: 28 }}>📝</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl * 2,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <ChildSelector />

        {childrenLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : !selectedChild ? (
          <EmptyState
            icon="👨‍👧‍👦"
            title="Aucun enfant selectionne"
            subtitle="Selectionnez un enfant pour voir les quiz disponibles."
          />
        ) : isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : visibleQuizzes.length === 0 ? (
          <EmptyState
            icon="📝"
            title="Aucun quiz disponible"
            subtitle="Il n'y a pas de quiz publie pour cette classe."
          />
        ) : (
          <>
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
              {visibleQuizzes.length} quiz{visibleQuizzes.length !== 1 ? "zes" : ""}
            </Text>

            {visibleQuizzes.map((quiz: Quiz) => {
              const badge = getStatusBadge(quiz.statut);
              return (
                <TouchableOpacity
                  key={quiz.id}
                  onPress={() =>
                    navigation.navigate("QuizDetail", {
                      quizId: quiz.id,
                      eleveId: selectedChild?.id,
                    })
                  }
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.lg,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderLeftWidth: 3,
                    borderLeftColor: colors.primary,
                  }}
                >
                  {/* Top row: title + badge */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: spacing.sm,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize.md,
                        fontWeight: "700",
                        color: colors.text,
                        flex: 1,
                        marginRight: spacing.sm,
                      }}
                      numberOfLines={2}
                    >
                      {quiz.titre}
                    </Text>
                    <Badge label={badge.label} color={badge.color} bgColor={badge.bgColor} />
                  </View>

                  {/* Module */}
                  {quiz.module && (
                    <Text
                      style={{
                        fontSize: fontSize.sm,
                        color: colors.primary,
                        fontWeight: "600",
                        marginBottom: spacing.sm,
                      }}
                    >
                      {quiz.module}
                    </Text>
                  )}

                  {/* Info row */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: spacing.lg,
                      paddingTop: spacing.sm,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontSize: 14, marginRight: 4 }}>❓</Text>
                      <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
                        {quiz.nbQuestions || "?"} questions
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontSize: 14, marginRight: 4 }}>⏱️</Text>
                      <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
                        {quiz.duree || "?"} min
                      </Text>
                    </View>
                    {quiz.maxTentatives > 0 && (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: 14, marginRight: 4 }}>🔄</Text>
                        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
                          {quiz.maxTentatives} essai{quiz.maxTentatives > 1 ? "s" : ""}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}
