import { type ReactNode } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { Badge } from "@/components/ui/Badge";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { AdminSchoolStackParamList } from "@/navigation/AdminSchoolStack";

type Route = RouteProp<AdminSchoolStackParamList, "TeacherDetail">;

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (value == null || value === "") return null;
  return (
    <View style={{ flexDirection: "row", paddingVertical: 6 }}>
      <Text style={{ flex: 1, fontSize: fontSize.xs, color: colors.textMuted }}>{label}</Text>
      <Text style={{ flex: 1.5, fontSize: fontSize.sm, color: colors.text, fontWeight: "600", textAlign: "right" }}>{value}</Text>
    </View>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, ...shadows.soft }}>
      <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

export default function AdminTeacherDetailScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<Route>();

  const teacherQ = useQuery({
    queryKey: ["admin", "teacher", params.teacherId],
    queryFn: () => adminApi.getTeacher(params.teacherId),
  });
  const affectationsQ = useQuery({
    queryKey: ["admin", "teacher", params.teacherId, "affectations"],
    queryFn: () => adminApi.getTeacherAffectations(params.teacherId),
  });

  if (teacherQ.isLoading) return <DetailSkeleton cardCount={3} />;
  if (teacherQ.isError || !teacherQ.data) return <ErrorView onRetry={() => teacherQ.refetch()} />;

  const t = teacherQ.data;
  const affectations = affectationsQ.data ?? [];
  const statusActif = (t.statut ?? "").toLowerCase() === "actif";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={{ backgroundColor: colors.background, borderRadius: 18, padding: spacing.md, marginBottom: spacing.md, alignItems: "center", ...shadows.soft }}>
          <View style={{
            width: 72, height: 72, borderRadius: 24, backgroundColor: colors.primary + "15",
            justifyContent: "center", alignItems: "center", marginBottom: spacing.md,
          }}>
            <Text style={{ fontSize: 26, fontWeight: "800", color: colors.primary }}>
              {t.firstName?.[0]}{t.lastName?.[0]}
            </Text>
          </View>
          <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.text }}>
            {t.firstName} {t.lastName}
          </Text>
          {t.specialization && (
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
              {t.specialization}
            </Text>
          )}
          <View style={{ marginTop: spacing.sm }}>
            <Badge
              label={t.statut || "—"}
              color={statusActif ? colors.success : colors.textMuted}
              bgColor={statusActif ? colors.success + "15" : colors.surfaceHover}
            />
          </View>
        </View>

        {/* Coordonnées */}
        {(t.email || t.telephone) && (
          <InfoCard title="Coordonnées">
            <InfoRow label="E-mail" value={t.email} />
            <InfoRow label="Téléphone" value={t.telephone} />
          </InfoCard>
        )}

        {/* Identité */}
        {(t.sexe || t.dateNaissance || t.dateEmbauche) && (
          <InfoCard title="Identité & emploi">
            <InfoRow label="Sexe" value={t.sexe} />
            <InfoRow label="Date de naissance" value={t.dateNaissance} />
            <InfoRow label="Date d'embauche" value={t.dateEmbauche} />
          </InfoCard>
        )}

        {/* Classes & matières */}
        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
          CLASSES & MATIÈRES ({affectations.length})
        </Text>
        {affectationsQ.isError ? (
          <Text style={{ fontSize: fontSize.sm, color: colors.textMuted }}>
            Affectations indisponibles.
          </Text>
        ) : affectations.length === 0 ? (
          <EmptyState icon="🏫" title="Aucune affectation" subtitle="Cet enseignant n'a pas de classe assignée." />
        ) : (
          affectations.map((a) => (
            <View key={a.id} style={{
              flexDirection: "row", alignItems: "center",
              backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, marginBottom: 8, ...shadows.soft,
            }}>
              <View style={{
                width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary + "12",
                justifyContent: "center", alignItems: "center", marginRight: spacing.md,
              }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: colors.primary }}>
                  {a.classeName}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                  Classe {a.classeName}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                  {a.moduleName ?? "Professeur principal"}
                  {a.anneeScolaire ? `  ·  ${a.anneeScolaire}` : ""}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
