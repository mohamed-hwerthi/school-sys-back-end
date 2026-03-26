import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useMemo } from "react";
import { useChild } from "@/context/ChildContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { devoirsApi } from "@/api/devoirs.api";
import { EmptyState } from "@/components/EmptyState";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface Homework {
  id: number;
  titre: string;
  description: string;
  moduleName: string;
  moduleId: number;
  dateEcheance: string;
  statut: string;
  pieceJointes: string[];
  createdAt: string;
}

interface Submission {
  id: number;
  devoirId: number;
  note: number | null;
  statut: string;
  commentaire: string;
  dateSoumission: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCountdown(dateStr: string): { label: string; color: string } {
  if (!dateStr) return { label: "--", color: colors.textMuted };
  const now = new Date();
  const target = new Date(dateStr);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? "s" : ""}`, color: colors.error };
  }
  if (diffDays === 0) return { label: "Aujourd'hui", color: colors.warning };
  if (diffDays === 1) return { label: "Demain", color: colors.warning };
  if (diffDays <= 3) return { label: `Dans ${diffDays} jours`, color: colors.warning };
  return { label: `Dans ${diffDays} jours`, color: colors.success };
}

export default function HomeworkDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const homeworkId = route.params?.homeworkId as number;
  const { selectedChild } = useChild();

  const {
    data: homework,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["devoir", homeworkId],
    queryFn: () => devoirsApi.getById(homeworkId),
    enabled: !!homeworkId,
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ["submissions", selectedChild?.id],
    queryFn: () => devoirsApi.getSubmissions(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  // Find submission for this homework
  const submission: Submission | null = useMemo(() => {
    if (!submissions.length) return null;
    return submissions.find((s: Submission) => s.devoirId === homeworkId) || null;
  }, [submissions, homeworkId]);

  const countdown = homework ? getCountdown(homework.dateEcheance) : null;
  const attachments: string[] = homework?.pieceJointes || [];

  const handleFilePickerPlaceholder = () => {
    Alert.alert(
      "Bientot disponible",
      "La selection de fichiers sera disponible dans une prochaine mise a jour."
    );
  };

  const handleSubmit = () => {
    Alert.alert(
      "Bientot disponible",
      "La soumission en ligne sera disponible dans une prochaine mise a jour."
    );
  };

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
          Detail du devoir
        </Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : isError || !homework ? (
        <View style={{ flex: 1, justifyContent: "center", padding: spacing.lg }}>
          <EmptyState
            icon="📚"
            title="Devoir introuvable"
            subtitle="Ce devoir n'existe pas ou a ete supprime."
          />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
        >
          {/* Module badge */}
          {homework.moduleName && (
            <View
              style={{
                backgroundColor: colors.primary + "15",
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.md,
                alignSelf: "flex-start",
                marginBottom: spacing.md,
              }}
            >
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.primary }}>
                {homework.moduleName}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text
            style={{
              fontSize: fontSize.xxl,
              fontWeight: "800",
              color: colors.text,
              marginBottom: spacing.md,
              lineHeight: 34,
            }}
          >
            {homework.titre || "Devoir"}
          </Text>

          {/* Deadline with countdown */}
          <View
            style={{
              backgroundColor: countdown ? countdown.color + "10" : colors.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: countdown ? countdown.color + "20" : colors.border,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, marginRight: spacing.md }}>📅</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Date limite</Text>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text, marginTop: 2 }}>
                {formatDate(homework.dateEcheance)}
              </Text>
            </View>
            {countdown && (
              <View
                style={{
                  backgroundColor: countdown.color + "15",
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.md,
                }}
              >
                <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: countdown.color }}>
                  {countdown.label}
                </Text>
              </View>
            )}
          </View>

          {/* Full Description */}
          <View
            style={{
              marginBottom: spacing.lg,
              paddingBottom: spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, marginBottom: spacing.sm }}>
              Description
            </Text>
            <Text
              style={{
                fontSize: fontSize.md,
                color: colors.text,
                lineHeight: 26,
              }}
            >
              {homework.description || "Aucune description disponible."}
            </Text>
          </View>

          {/* Attachments */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, marginBottom: spacing.sm }}>
              Pieces jointes
            </Text>
            {attachments.length === 0 ? (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center" }}>
                  Aucune piece jointe
                </Text>
              </View>
            ) : (
              attachments.map((attachment: string, index: number) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.xs,
                    borderWidth: 1,
                    borderColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, marginRight: spacing.sm }}>📎</Text>
                  <Text
                    style={{
                      fontSize: fontSize.sm,
                      color: colors.text,
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {attachment}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Submission Section */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, marginBottom: spacing.md }}>
              Soumission
            </Text>

            {submission ? (
              <>
                {/* Already submitted */}
                <View
                  style={{
                    backgroundColor: colors.success + "10",
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                    borderWidth: 1,
                    borderColor: colors.success + "20",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
                    <Text style={{ fontSize: 16, marginRight: spacing.sm }}>✅</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.success }}>
                      Devoir soumis
                    </Text>
                  </View>
                  {submission.dateSoumission && (
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
                      Soumis le {formatDate(submission.dateSoumission)}
                    </Text>
                  )}
                </View>

                {/* Grade */}
                {submission.note != null && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.md,
                      marginBottom: spacing.sm,
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Note</Text>
                      <Text
                        style={{
                          fontSize: fontSize.xxl,
                          fontWeight: "900",
                          color: submission.note >= 10 ? colors.success : colors.error,
                        }}
                      >
                        {submission.note}/20
                      </Text>
                    </View>
                  </View>
                )}

                {/* Status */}
                {submission.statut && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Statut:</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                      {submission.statut}
                    </Text>
                  </View>
                )}

                {/* Comment */}
                {submission.commentaire && (
                  <View style={{ marginTop: spacing.sm }}>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Commentaire</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.text, marginTop: 2 }}>
                      {submission.commentaire}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {/* Not yet submitted */}
                <View
                  style={{
                    backgroundColor: colors.warning + "10",
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.warning + "20",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 16, marginRight: spacing.sm }}>⏳</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.warning }}>
                      Pas encore soumis
                    </Text>
                  </View>
                </View>

                {/* File Picker Placeholder */}
                <TouchableOpacity
                  onPress={handleFilePickerPlaceholder}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: borderRadius.md,
                    padding: spacing.lg,
                    marginBottom: spacing.md,
                    borderWidth: 2,
                    borderStyle: "dashed",
                    borderColor: colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 28, marginBottom: spacing.sm }}>📁</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary }}>
                    Ajouter un fichier
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                    Appuyer pour selectionner
                  </Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    alignItems: "center",
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: "#fff" }}>
                    Soumettre le devoir
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
