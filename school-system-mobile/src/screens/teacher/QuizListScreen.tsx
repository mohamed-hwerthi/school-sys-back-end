import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { quizzesApi } from "@/api/quizzes.api";
import { GradientHeader } from "@/components/GradientHeader";
import { Badge } from "@/components/ui/Badge";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { TeacherMoreStackParamList } from "@/types/teacher";

type Nav = NativeStackNavigationProp<TeacherMoreStackParamList, "QuizList">;

export function quizStatutBadge(statut: string) {
  const s = (statut ?? "").toUpperCase();
  if (s === "PUBLIE") return { label: "Publié", color: colors.success, bg: colors.success + "15" };
  if (s === "BROUILLON") return { label: "Brouillon", color: colors.warning, bg: colors.warning + "15" };
  return { label: statut || "—", color: colors.textMuted, bg: colors.surfaceHover };
}

export default function QuizListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const quizzesQ = useQuery({ queryKey: ["quiz", "list"], queryFn: quizzesApi.getQuizzes });
  const quizzes = quizzesQ.data ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <GradientHeader title="Quiz" subtitle="Vos quiz en ligne" showBack />

      {quizzesQ.isLoading ? (
        <ListSkeleton count={5} avatar={false} />
      ) : quizzesQ.isError ? (
        <ErrorView message="Impossible de charger les quiz" onRetry={() => quizzesQ.refetch()} />
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(q) => q.id}
          contentContainerStyle={{ padding: spacing.lg }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => quizzesQ.refetch()}
          refreshing={quizzesQ.isFetching}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <EmptyState icon="🎯" title="Aucun quiz" subtitle="Créez vos quiz depuis l'application web." />
          }
          renderItem={({ item }) => {
            const b = quizStatutBadge(item.statut);
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("QuizDetail", { quizId: item.id })}
                style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 }} numberOfLines={1}>
                    {item.titre}
                  </Text>
                  <Badge label={b.label} color={b.color} bgColor={b.bg} />
                </View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 6 }}>
                  {`${item.totalQuestions} question(s)   ·   ${item.totalTentatives} tentative(s)`}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
