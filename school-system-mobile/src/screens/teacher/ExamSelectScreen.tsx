import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { gradesApi } from "@/api/grades.api";
import { SegmentedControl } from "@/components/SegmentedControl";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";
import type { TeacherClassesStackParamList } from "@/types/teacher";

type ExamSelectRoute = RouteProp<TeacherClassesStackParamList, "ExamSelect">;
type ExamSelectNav = NativeStackNavigationProp<TeacherClassesStackParamList, "ExamSelect">;

const TRIMESTRES = [
  { value: "1", label: "Trimestre 1" },
  { value: "2", label: "Trimestre 2" },
  { value: "3", label: "Trimestre 3" },
];

export default function ExamSelectScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<ExamSelectRoute>();
  const navigation = useNavigation<ExamSelectNav>();
  const [trimestre, setTrimestre] = useState("1");

  const examensQ = useQuery({
    queryKey: ["teacher", "examens", params.classeId, trimestre],
    queryFn: () => gradesApi.getExamens(params.classeId, Number(trimestre)),
  });

  const examens = examensQ.data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "bottom"]}>
      <View style={{ padding: spacing.lg, paddingBottom: spacing.sm }}>
        <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
          TRIMESTRE
        </Text>
        <SegmentedControl options={TRIMESTRES} value={trimestre} onChange={setTrimestre} />
      </View>

      {examensQ.isLoading ? (
        <ListSkeleton count={5} avatar={false} />
      ) : examensQ.isError ? (
        <ErrorView message="Impossible de charger les examens" onRetry={() => examensQ.refetch()} />
      ) : (
        <FlatList
          data={examens}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListEmptyComponent={
            <EmptyState
              icon="📝"
              title="Aucun examen"
              subtitle="Aucun examen pour ce trimestre. Créez-en un depuis l'application web."
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("GradeEntry", {
                  classeId: params.classeId,
                  niveauName: params.niveauName,
                  letter: params.letter,
                  fullName: params.fullName,
                  examenId: item.id,
                  examenName: item.name,
                  trimestre: Number(trimestre),
                })
              }
              style={{
                flexDirection: "row", alignItems: "center",
                backgroundColor: colors.surface, borderRadius: borderRadius.md,
                borderWidth: 1, borderColor: colors.border, padding: spacing.md,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                  {[item.moduleName, `${item.nbNotes}/${item.nbEleves} notes saisies`].filter(Boolean).join(" · ")}
                </Text>
              </View>
              <Text style={{ fontSize: fontSize.xl, color: colors.textMuted }}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
