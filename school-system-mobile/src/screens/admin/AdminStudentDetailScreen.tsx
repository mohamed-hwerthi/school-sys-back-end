import { useState, type ReactNode } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { gradesApi } from "@/api/grades.api";
import { attendanceApi } from "@/api/attendance.api";
import { incidentsApi } from "@/api/incidents.api";
import { Badge } from "@/components/ui/Badge";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, shadows, borderRadius } from "@/constants/theme";
import type { AdminStudentsStackParamList } from "@/navigation/AdminStudentsStack";

type DetailRoute = RouteProp<AdminStudentsStackParamList, "StudentDetail">;
type Tab = "infos" | "notes" | "absences" | "discipline";

const TABS: { value: Tab; label: string }[] = [
  { value: "infos", label: "Infos" },
  { value: "notes", label: "Notes" },
  { value: "absences", label: "Absences" },
  { value: "discipline", label: "Discipline" },
];

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  const { colors } = useTheme();
  if (value == null || value === "") return null;
  return (
    <View style={{ flexDirection: "row", paddingVertical: 6 }}>
      <Text style={{ flex: 1, fontSize: fontSize.xs, color: colors.textMuted }}>{label}</Text>
      <Text style={{ flex: 1.5, fontSize: fontSize.sm, color: colors.text, fontWeight: "600", textAlign: "right" }}>{value}</Text>
    </View>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, ...shadows.soft }}>
      <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function KpiSmall({ label, value, color }: { label: string; value: number; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, alignItems: "center", ...shadows.soft }}>
      <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color }}>{value}</Text>
      <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function AdminStudentDetailScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<DetailRoute>();
  const [tab, setTab] = useState<Tab>("infos");
  const [trimestre, setTrimestre] = useState(1);

  const studentQ = useQuery({
    queryKey: ["admin", "student", params.studentId],
    queryFn: () => adminApi.getStudent(params.studentId),
  });
  const notesQ = useQuery({
    queryKey: ["admin", "student", params.studentId, "notes", trimestre],
    queryFn: () => gradesApi.getStudentNotes(params.studentId, trimestre),
    enabled: tab === "notes",
  });
  const absencesQ = useQuery({
    queryKey: ["admin", "student", params.studentId, "absences"],
    queryFn: () => attendanceApi.getStudentAbsences(params.studentId),
    enabled: tab === "absences",
  });
  const dossierQ = useQuery({
    queryKey: ["admin", "student", params.studentId, "dossier"],
    queryFn: () => incidentsApi.getStudentDossier(params.studentId),
    enabled: tab === "discipline",
  });

  if (studentQ.isLoading) return <DetailSkeleton cardCount={3} />;
  if (studentQ.isError || !studentQ.data) return <ErrorView onRetry={() => studentQ.refetch()} />;

  const s = studentQ.data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
      {/* Tabs */}
      <View style={{ flexDirection: "row", paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm, gap: 6 }}>
        {TABS.map((t) => {
          const active = t.value === tab;
          return (
            <TouchableOpacity
              key={t.value}
              activeOpacity={0.7}
              onPress={() => setTab(t.value)}
              style={{
                flex: 1, paddingVertical: 8, borderRadius: borderRadius.full,
                backgroundColor: active ? colors.primary : colors.background,
                borderWidth: 1, borderColor: active ? colors.primary : colors.border,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: active ? "#fff" : colors.text }}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }} showsVerticalScrollIndicator={false}>
        {/* ── INFOS ── */}
        {tab === "infos" && (
          <>
            <InfoCard title="Identité">
              <InfoRow label="Nom complet" value={`${s.firstName} ${s.lastName}`} />
              {(s.firstNameAr || s.lastNameAr) && (
                <InfoRow label="Nom (AR)" value={`${s.firstNameAr ?? ""} ${s.lastNameAr ?? ""}`.trim()} />
              )}
              <InfoRow label="Sexe" value={s.sex} />
              <InfoRow label="Date de naissance" value={s.dateOfBirth} />
              <InfoRow label="Lieu de naissance" value={s.birthPlace} />
              <InfoRow label="Matricule" value={s.matricule ?? s.registrationNumber} />
            </InfoCard>

            <InfoCard title="Scolarité">
              <InfoRow label="Niveau" value={s.niveau} />
              <InfoRow label="Classe" value={s.classe} />
              <InfoRow label="Date d'inscription" value={s.enrollmentDate} />
              <InfoRow label="Statut" value={s.status} />
              {s.isBlocked && (
                <View style={{ marginTop: spacing.sm, alignSelf: "flex-start" }}>
                  <Badge label="Bloqué" color={colors.error} bgColor={colors.error + "15"} />
                </View>
              )}
            </InfoCard>

            {(s.parentFirstName || s.parentLastName || s.parentPhone || s.parentEmail) && (
              <InfoCard title="Parent">
                <InfoRow label="Nom" value={`${s.parentFirstName ?? ""} ${s.parentLastName ?? ""}`.trim()} />
                <InfoRow label="Téléphone" value={s.parentPhone} />
                <InfoRow label="E-mail" value={s.parentEmail} />
              </InfoCard>
            )}

            {(s.address || s.email) && (
              <InfoCard title="Coordonnées">
                <InfoRow label="Adresse" value={s.address} />
                <InfoRow label="E-mail" value={s.email} />
              </InfoCard>
            )}
          </>
        )}

        {/* ── NOTES ── */}
        {tab === "notes" && (
          <>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: spacing.md }}>
              {[1, 2, 3].map((t) => {
                const active = t === trimestre;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTrimestre(t)}
                    style={{
                      paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.full,
                      backgroundColor: active ? colors.primary : "transparent",
                      borderWidth: 1, borderColor: active ? colors.primary : colors.border,
                    }}
                  >
                    <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: active ? "#fff" : colors.text }}>
                      Trimestre {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {notesQ.isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : notesQ.isError ? (
              <ErrorView message="Impossible de charger les notes" onRetry={() => notesQ.refetch()} />
            ) : !notesQ.data || notesQ.data.length === 0 ? (
              <EmptyState icon="📊" title="Aucune note" subtitle="Aucune note enregistrée pour ce trimestre." />
            ) : (
              notesQ.data.map((n) => (
                <View key={n.id} style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, marginBottom: 10, ...shadows.soft }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }} numberOfLines={1}>
                      {n.examenName ?? "Examen"}
                    </Text>
                    {n.observation ? (
                      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }} numberOfLines={2}>
                        {n.observation}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.primary + "12" }}>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.primary }}>
                      {n.valeur != null ? n.valeur : "—"}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {/* ── ABSENCES ── */}
        {tab === "absences" && (
          absencesQ.isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : absencesQ.isError ? (
            <ErrorView onRetry={() => absencesQ.refetch()} />
          ) : (() => {
            const list = absencesQ.data ?? [];
            const totalAbs = list.filter((a) => a.type === "ABSENCE").length;
            const totalRetards = list.filter((a) => a.type === "RETARD").length;
            const totalJust = list.filter((a) => a.justifie).length;
            return (
              <>
                <View style={{ flexDirection: "row", gap: 8, marginBottom: spacing.md }}>
                  <KpiSmall label="Total" value={list.length} color={colors.text} />
                  <KpiSmall label="Absences" value={totalAbs} color={colors.error} />
                  <KpiSmall label="Retards" value={totalRetards} color={colors.warning} />
                  <KpiSmall label="Justif." value={totalJust} color={colors.success} />
                </View>
                {list.length === 0 ? (
                  <EmptyState icon="🎉" title="Aucune absence" />
                ) : (
                  list.map((a) => (
                    <View key={a.id} style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, marginBottom: 8, ...shadows.soft }}>
                      <View style={{ width: 6, height: 36, borderRadius: 3, backgroundColor: a.type === "RETARD" ? colors.warning : colors.error, marginRight: spacing.md }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                          {a.type === "RETARD" ? "Retard" : "Absence"}{a.seance ? `  ·  ${a.seance}` : ""}
                        </Text>
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                          {a.date}{a.motif ? `  ·  ${a.motif}` : ""}
                        </Text>
                      </View>
                      {a.justifie && <Badge label="Justifiée" color={colors.success} bgColor={colors.success + "15"} />}
                    </View>
                  ))
                )}
              </>
            );
          })()
        )}

        {/* ── DISCIPLINE ── */}
        {tab === "discipline" && (
          dossierQ.isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : dossierQ.isError ? (
            <ErrorView onRetry={() => dossierQ.refetch()} />
          ) : !dossierQ.data ? null : (
            <>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: spacing.md }}>
                <KpiSmall label="Incidents" value={dossierQ.data.totalIncidents} color={colors.warning} />
                <KpiSmall label="Sanctions" value={dossierQ.data.totalSanctions} color={colors.error} />
                <KpiSmall label="Niveau" value={dossierQ.data.niveauActuel} color={colors.primary} />
              </View>
              {dossierQ.data.timeline.length === 0 ? (
                <EmptyState icon="🛡️" title="Dossier vierge" subtitle="Aucun incident ni sanction enregistré." />
              ) : (
                dossierQ.data.timeline.map((e) => (
                  <View key={e.id} style={{ flexDirection: "row", backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, marginBottom: 8, ...shadows.soft }}>
                    <View style={{
                      width: 6, height: 36, borderRadius: 3,
                      backgroundColor: e.type === "INCIDENT" ? colors.warning : colors.error,
                      marginRight: spacing.md, alignSelf: "center",
                    }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                        {e.type === "INCIDENT" ? "Incident" : "Sanction"}{e.gravite ? `  ·  ${e.gravite}` : ""}
                      </Text>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }} numberOfLines={2}>
                        {e.description || "—"}
                      </Text>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>{e.date}</Text>
                    </View>
                    {e.statut && <Badge label={e.statut} color={colors.textMuted} bgColor={colors.surfaceHover} />}
                  </View>
                ))
              )}
            </>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
