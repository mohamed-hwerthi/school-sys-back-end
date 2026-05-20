import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { homeworkApi } from "@/api/homework.api";
import { teacherApi } from "@/api/teacher.api";
import { Badge } from "@/components/ui/Badge";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { TeacherDevoirsStackParamList } from "@/types/teacher";

type DetailRoute = RouteProp<TeacherDevoirsStackParamList, "DevoirDetail">;
type Nav = NativeStackNavigationProp<TeacherDevoirsStackParamList, "DevoirDetail">;

export default function DevoirDetailScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<DetailRoute>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();

  const devoirQ = useQuery({
    queryKey: ["homework", "devoir", params.devoirId],
    queryFn: () => homeworkApi.getDevoir(params.devoirId),
  });
  const submissionsQ = useQuery({
    queryKey: ["homework", "submissions", params.devoirId],
    queryFn: () => homeworkApi.getSubmissions(params.devoirId),
  });
  const classesQ = useQuery({ queryKey: ["teacher", "classes"], queryFn: teacherApi.getClasses });

  const devoir = devoirQ.data;
  const classe = devoir?.classeId ? (classesQ.data ?? []).find((c) => c.id === devoir.classeId) : undefined;

  const studentsQ = useQuery({
    queryKey: ["teacher", "students", classe?.niveauName, classe?.letter],
    queryFn: () => teacherApi.getStudents(classe!.niveauName, classe!.letter),
    enabled: !!classe,
  });
  const studentName = new Map(
    (studentsQ.data?.content ?? []).map((s) => [s.id, `${s.firstName} ${s.lastName}`]),
  );

  const closeMutation = useMutation({
    mutationFn: () => homeworkApi.closeDevoir(params.devoirId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework", "devoir", params.devoirId] });
      queryClient.invalidateQueries({ queryKey: ["homework", "devoirs"] });
    },
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec."),
  });
  const deleteMutation = useMutation({
    mutationFn: () => homeworkApi.deleteDevoir(params.devoirId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework", "devoirs"] });
      navigation.goBack();
    },
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec."),
  });

  const confirmDelete = () =>
    Alert.alert("Supprimer le devoir", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => deleteMutation.mutate() },
    ]);

  if (devoirQ.isLoading) return <DetailSkeleton cardCount={2} />;
  if (devoirQ.isError || !devoir) return <ErrorView onRetry={() => devoirQ.refetch()} />;

  const submissions = submissionsQ.data ?? [];
  const isClosed = !(devoir.statut ?? "").toUpperCase().startsWith("PUBLI");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={devoirQ.isFetching || submissionsQ.isFetching}
            onRefresh={() => { devoirQ.refetch(); submissionsQ.refetch(); }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Info card */}
        <View style={{ backgroundColor: colors.background, borderRadius: 18, padding: spacing.md, ...shadows.soft }}>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.text }}>{devoir.titre}</Text>
          {devoir.description ? (
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 6 }}>
              {devoir.description}
            </Text>
          ) : null}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.md }}>
            {classe && <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>🏫 Classe {classe.fullName}</Text>}
            {devoir.dateLimite && <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>📅 {devoir.dateLimite}</Text>}
            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>🎯 /{devoir.pointsMax}</Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>📥 {devoir.totalSoumissions} soumission(s)</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: spacing.md }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("DevoirForm", { devoirId: devoir.id })}
            style={{ flex: 1, backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, alignItems: "center", ...shadows.soft }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.primary }}>✏️  Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isClosed || closeMutation.isPending}
            onPress={() => closeMutation.mutate()}
            style={{
              flex: 1, backgroundColor: colors.background, borderRadius: 14, padding: spacing.md,
              alignItems: "center", opacity: isClosed ? 0.5 : 1, ...shadows.soft,
            }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
              {isClosed ? "🔒  Clôturé" : "🔒  Clôturer"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={confirmDelete}
          style={{
            marginTop: 10, backgroundColor: colors.error + "10", borderRadius: 14, padding: spacing.md,
            alignItems: "center", borderWidth: 1, borderColor: colors.error + "20",
          }}
        >
          <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.error }}>Supprimer le devoir</Text>
        </TouchableOpacity>

        {/* Submissions */}
        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginTop: spacing.xl, marginBottom: spacing.sm }}>
          SOUMISSIONS ({submissions.length})
        </Text>
        {submissions.length === 0 ? (
          <EmptyState icon="📭" title="Aucune soumission" subtitle="Aucun élève n'a encore rendu ce devoir." />
        ) : (
          submissions.map((s) => (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("SubmissionCorrection", {
                  soumissionId: s.id,
                  devoirId: params.devoirId,
                  pointsMax: devoir.pointsMax,
                  studentName: studentName.get(s.eleveId) ?? "Élève",
                })
              }
              style={{
                flexDirection: "row", alignItems: "center", marginBottom: 10,
                backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, ...shadows.soft,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                  {studentName.get(s.eleveId) ?? "Élève"}
                </Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                  {s.corrige
                    ? <Badge label={`Noté ${s.note ?? "—"}/${devoir.pointsMax}`} color={colors.success} bgColor={colors.success + "15"} />
                    : <Badge label="À corriger" color={colors.warning} bgColor={colors.warning + "15"} />}
                  {s.enRetard && <Badge label="En retard" color={colors.error} bgColor={colors.error + "15"} />}
                </View>
              </View>
              <Text style={{ fontSize: fontSize.xl, color: colors.textMuted }}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
