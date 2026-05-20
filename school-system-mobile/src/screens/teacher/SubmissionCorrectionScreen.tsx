import { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { homeworkApi, type CorrectionInput } from "@/api/homework.api";
import { Badge } from "@/components/ui/Badge";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize } from "@/constants/theme";
import type { TeacherDevoirsStackParamList } from "@/types/teacher";

type CorrectionRoute = RouteProp<TeacherDevoirsStackParamList, "SubmissionCorrection">;

const inputStyle = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 14,
  paddingHorizontal: spacing.md,
  paddingVertical: 12,
  fontSize: fontSize.md,
  color: colors.text,
};

export default function SubmissionCorrectionScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<CorrectionRoute>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const submissionsQ = useQuery({
    queryKey: ["homework", "submissions", params.devoirId],
    queryFn: () => homeworkApi.getSubmissions(params.devoirId),
  });
  const soumission = submissionsQ.data?.find((s) => s.id === params.soumissionId);

  const [note, setNote] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (soumission && !prefilled) {
      if (soumission.note != null) setNote(String(soumission.note));
      if (soumission.commentaireCorrection) setCommentaire(soumission.commentaireCorrection);
      setPrefilled(true);
    }
  }, [soumission, prefilled]);

  const mutation = useMutation({
    mutationFn: (input: CorrectionInput) => homeworkApi.correctSubmission(params.soumissionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework", "submissions", params.devoirId] });
      queryClient.invalidateQueries({ queryKey: ["homework", "devoir", params.devoirId] });
      Alert.alert("Correction enregistrée", "La note a été enregistrée.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    },
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec."),
  });

  const handleSave = () => {
    const value = Number(note.trim().replace(",", "."));
    if (Number.isNaN(value) || value < 0 || value > params.pointsMax) {
      Alert.alert("Note invalide", `La note doit être comprise entre 0 et ${params.pointsMax}.`);
      return;
    }
    mutation.mutate({ note: value, commentaire: commentaire.trim() || undefined });
  };

  if (submissionsQ.isLoading) return <DetailSkeleton cardCount={2} />;
  if (submissionsQ.isError) return <ErrorView onRetry={() => submissionsQ.refetch()} />;
  if (!soumission) return <ErrorView message="Soumission introuvable" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.text }}>{params.studentName}</Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 6, marginBottom: spacing.lg }}>
          {soumission.corrige
            ? <Badge label="Déjà corrigé" color={colors.success} bgColor={colors.success + "15"} />
            : <Badge label="À corriger" color={colors.warning} bgColor={colors.warning + "15"} />}
          {soumission.enRetard && <Badge label="En retard" color={colors.error} bgColor={colors.error + "15"} />}
        </View>

        {/* Submission content */}
        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.text, letterSpacing: 0.5, marginBottom: 6 }}>
          COPIE DE L'ÉLÈVE
        </Text>
        <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: spacing.md, marginBottom: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.text }}>
            {soumission.contenu || "Aucun contenu texte."}
          </Text>
          {soumission.fichierUrl ? (
            <Text style={{ fontSize: fontSize.xs, color: colors.primary, marginTop: 8 }}>
              📎 {soumission.fichierUrl}
            </Text>
          ) : null}
        </View>

        {/* Grade */}
        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.text, letterSpacing: 0.5, marginBottom: 6 }}>
          NOTE  (sur {params.pointsMax})
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={`—/${params.pointsMax}`}
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          maxLength={6}
          style={{ ...inputStyle, width: 120, textAlign: "center", fontWeight: "800", marginBottom: spacing.md }}
        />

        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.text, letterSpacing: 0.5, marginBottom: 6 }}>
          COMMENTAIRE
        </Text>
        <TextInput
          value={commentaire}
          onChangeText={setCommentaire}
          placeholder="Commentaire de correction (optionnel)"
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
          style={{ ...inputStyle, minHeight: 100 }}
        />
      </ScrollView>

      <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border }}>
        <TouchableOpacity onPress={handleSave} disabled={mutation.isPending} activeOpacity={0.85}>
          <View style={{
            backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15,
            alignItems: "center", opacity: mutation.isPending ? 0.7 : 1,
          }}>
            {mutation.isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: "#fff", fontWeight: "800", fontSize: fontSize.md }}>Enregistrer la correction</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
