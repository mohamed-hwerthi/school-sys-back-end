import { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "@/api/teacher.api";
import { gradesApi, type NoteRequest } from "@/api/grades.api";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";
import type { TeacherClassesStackParamList } from "@/types/teacher";

type GradeEntryRoute = RouteProp<TeacherClassesStackParamList, "GradeEntry">;

const MAX_GRADE = 20;

export default function GradeEntryScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<GradeEntryRoute>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const [grades, setGrades] = useState<Record<string, string>>({});
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [prefilled, setPrefilled] = useState(false);

  const studentsQ = useQuery({
    queryKey: ["teacher", "students", params.niveauName, params.letter],
    queryFn: () => teacherApi.getStudents(params.niveauName, params.letter),
  });
  const notesQ = useQuery({
    queryKey: ["teacher", "notes", params.examenId, params.trimestre],
    queryFn: () => gradesApi.getNotes(params.examenId, params.trimestre),
  });

  const students = studentsQ.data?.content ?? [];

  // Pre-fill the form once from the grades already recorded for this exam.
  useEffect(() => {
    if (notesQ.data && !prefilled) {
      const g: Record<string, string> = {};
      const o: Record<string, string> = {};
      for (const n of notesQ.data) {
        if (n.valeur != null) g[n.studentId] = String(n.valeur);
        if (n.observation) o[n.studentId] = n.observation;
      }
      setGrades(g);
      setObservations(o);
      setPrefilled(true);
    }
  }, [notesQ.data, prefilled]);

  const mutation = useMutation({
    mutationFn: (notes: NoteRequest[]) => gradesApi.bulkUpsertNotes(notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "notes", params.examenId, params.trimestre] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "examens", params.classeId] });
      Alert.alert("Notes enregistrées", "Les notes ont été enregistrées.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    },
    onError: (e: unknown) =>
      Alert.alert("Erreur", e instanceof Error ? e.message : "Échec de l'enregistrement."),
  });

  const handleSave = () => {
    const payload: NoteRequest[] = [];
    for (const s of students) {
      const raw = (grades[s.id] ?? "").trim().replace(",", ".");
      if (raw === "") continue;
      const value = Number(raw);
      if (Number.isNaN(value) || value < 0 || value > MAX_GRADE) {
        Alert.alert(
          "Note invalide",
          `${s.firstName} ${s.lastName} : la note doit être comprise entre 0 et ${MAX_GRADE}.`,
        );
        return;
      }
      payload.push({
        studentId: s.id,
        examenId: params.examenId,
        trimestre: params.trimestre,
        valeur: value,
        observation: observations[s.id]?.trim() || undefined,
      });
    }
    if (payload.length === 0) {
      Alert.alert("Aucune note", "Saisissez au moins une note avant d'enregistrer.");
      return;
    }
    mutation.mutate(payload);
  };

  if (studentsQ.isLoading || notesQ.isLoading) return <ListSkeleton count={6} avatar={false} trailing={false} />;
  if (studentsQ.isError) return <ErrorView onRetry={() => studentsQ.refetch()} />;

  const filledCount = students.filter((s) => (grades[s.id] ?? "").trim() !== "").length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
          {params.examenName}
        </Text>
        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginBottom: spacing.lg }}>
          Trimestre {params.trimestre} · notes sur {MAX_GRADE}
        </Text>

        {students.length === 0 ? (
          <EmptyState icon="👥" title="Aucun élève" subtitle="Cette classe n'a aucun élève inscrit." />
        ) : (
          students.map((s) => (
            <View key={s.id} style={{ marginBottom: spacing.md }}>
              <Text style={{ fontSize: fontSize.md, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
                {s.firstName} {s.lastName}
              </Text>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <TextInput
                  value={grades[s.id] ?? ""}
                  onChangeText={(t) => setGrades((prev) => ({ ...prev, [s.id]: t }))}
                  placeholder={`—/${MAX_GRADE}`}
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  maxLength={5}
                  style={{
                    width: 76, textAlign: "center",
                    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
                    padding: spacing.md, fontSize: fontSize.md, fontWeight: "700",
                    color: colors.text, backgroundColor: colors.surface,
                  }}
                />
                <TextInput
                  value={observations[s.id] ?? ""}
                  onChangeText={(t) => setObservations((prev) => ({ ...prev, [s.id]: t }))}
                  placeholder="Observation (optionnel)"
                  placeholderTextColor={colors.textMuted}
                  style={{
                    flex: 1,
                    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
                    padding: spacing.md, fontSize: fontSize.sm,
                    color: colors.text, backgroundColor: colors.surface,
                  }}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {students.length > 0 && (
        <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border }}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={mutation.isPending}
            style={{
              backgroundColor: colors.primary, borderRadius: borderRadius.md,
              padding: spacing.md, alignItems: "center", opacity: mutation.isPending ? 0.7 : 1,
            }}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: fontSize.md }}>
                Enregistrer{filledCount > 0 ? ` (${filledCount})` : ""}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
