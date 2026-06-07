import { useState, type ReactNode } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { gradesApi } from "@/api/grades.api";
import { attendanceApi } from "@/api/attendance.api";
import { bulletinApi } from "@/api/bulletin.api";
import { Badge } from "@/components/ui/Badge";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, shadows, borderRadius } from "@/constants/theme";
import type { TeacherClassesStackParamList } from "@/types/teacher";

type DetailRoute = RouteProp<TeacherClassesStackParamList, "StudentDetail">;
type Nav = NativeStackNavigationProp<TeacherClassesStackParamList, "StudentDetail">;
type Tab = "infos" | "notes" | "absences" | "bulletin";

const TABS: { value: Tab; label: string }[] = [
  { value: "infos", label: "Infos" },
  { value: "notes", label: "Notes" },
  { value: "absences", label: "Absences" },
  { value: "bulletin", label: "Bulletin" },
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

function gradeColor(note: number | null | undefined, palette: { success: string; warning: string; error: string; textMuted: string }) {
  if (note == null) return palette.textMuted;
  if (note >= 14) return palette.success;
  if (note >= 10) return palette.warning;
  return palette.error;
}

export default function TeacherStudentDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<DetailRoute>();
  const [tab, setTab] = useState<Tab>("infos");
  const [trimestre, setTrimestre] = useState(1);

  const studentQ = useQuery({
    queryKey: ["teacher", "student", params.studentId],
    queryFn: () => adminApi.getStudent(params.studentId),
  });
  const notesQ = useQuery({
    queryKey: ["teacher", "student", params.studentId, "notes", trimestre],
    queryFn: () => gradesApi.getStudentNotes(params.studentId, trimestre),
    enabled: tab === "notes",
  });
  const absencesQ = useQuery({
    queryKey: ["teacher", "student", params.studentId, "absences"],
    queryFn: () => attendanceApi.getStudentAbsences(params.studentId),
    enabled: tab === "absences",
  });
  const bulletinQ = useQuery({
    queryKey: ["teacher", "student", params.studentId, "bulletin", params.classeId, trimestre],
    queryFn: () => bulletinApi.getStudentBulletin(params.studentId, params.classeId, trimestre),
    enabled: tab === "bulletin",
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

      {/* Trimestre selector for Notes + Bulletin */}
      {(tab === "notes" || tab === "bulletin") && (
        <View style={{ flexDirection: "row", paddingHorizontal: spacing.lg, gap: 6, marginBottom: spacing.sm }}>
          {[1, 2, 3].map((t) => {
            const active = t === trimestre;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTrimestre(t)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 6, borderRadius: borderRadius.full,
                  backgroundColor: active ? colors.primary : "transparent",
                  borderWidth: 1, borderColor: active ? colors.primary : colors.border,
                }}
              >
                <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: active ? "#fff" : colors.text }}>
                  T{t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

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
              <InfoRow label="Matricule" value={s.matricule ?? s.registrationNumber} />
            </InfoCard>

            <InfoCard title="Scolarité">
              <InfoRow label="Niveau" value={s.niveau} />
              <InfoRow label="Classe" value={s.classe} />
              <InfoRow label="Statut" value={s.status} />
              {s.isBlocked && (
                <View style={{ marginTop: spacing.sm, alignSelf: "flex-start" }}>
                  <Badge label="Bloqué" color={colors.error} bgColor={colors.error + "15"} />
                </View>
              )}
            </InfoCard>

            {(s.parentFirstName || s.parentLastName || s.parentPhone) && (
              <InfoCard title="Parent">
                <InfoRow label="Nom" value={`${s.parentFirstName ?? ""} ${s.parentLastName ?? ""}`.trim()} />
                <InfoRow label="Téléphone" value={s.parentPhone} />
                <InfoRow label="E-mail" value={s.parentEmail} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("NotifyParent", {
                    studentId: s.id, studentName: `${s.firstName} ${s.lastName}`,
                  })}
                  style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "center",
                    backgroundColor: colors.primary, borderRadius: 12,
                    paddingVertical: 12, marginTop: spacing.sm,
                  }}
                >
                  <Ionicons name="send-outline" size={16} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: fontSize.sm, marginLeft: 8 }}>
                    Contacter le parent
                  </Text>
                </TouchableOpacity>
              </InfoCard>
            )}
          </>
        )}

        {/* ── NOTES ── */}
        {tab === "notes" && (
          <>
            {notesQ.isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : notesQ.isError ? (
              <ErrorView message="Impossible de charger les notes" onRetry={() => notesQ.refetch()} />
            ) : !notesQ.data || notesQ.data.length === 0 ? (
              <EmptyState icon="📊" title="Aucune note" subtitle={`Aucune note enregistrée au trimestre ${trimestre}.`} />
            ) : (
              notesQ.data.map((n) => {
                const c = gradeColor(n.valeur, colors);
                return (
                  <View key={n.id} style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, marginBottom: 10, ...shadows.soft }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }} numberOfLines={1}>
                        {n.examenName ?? "Examen"}
                      </Text>
                      {n.observation ? (
                        <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 4 }} numberOfLines={2}>
                          {n.observation}
                        </Text>
                      ) : null}
                    </View>
                    <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: c + "15" }}>
                      <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: c }}>
                        {n.valeur != null ? n.valeur : "—"}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {/* ── ABSENCES ── */}
        {tab === "absences" && (
          <>
            {absencesQ.isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : absencesQ.isError ? (
              <ErrorView message="Impossible de charger les absences" onRetry={() => absencesQ.refetch()} />
            ) : !absencesQ.data || absencesQ.data.length === 0 ? (
              <EmptyState icon="📅" title="Aucune absence" subtitle="Cet élève n'a aucune absence enregistrée." />
            ) : (
              absencesQ.data.map((a) => (
                <View key={a.id} style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, marginBottom: 8, ...shadows.soft }}>
                  <View style={{ width: 6, height: 36, borderRadius: 3, backgroundColor: a.type === "RETARD" ? colors.warning : colors.error, marginRight: spacing.md }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                      {a.type === "RETARD" ? "Retard" : "Absence"}  ·  {a.date}
                    </Text>
                    {a.motif ? (
                      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }} numberOfLines={2}>{a.motif}</Text>
                    ) : null}
                  </View>
                  {a.justifie ? (
                    <Badge label="Justifié" color={colors.success} bgColor={colors.success + "15"} />
                  ) : (
                    <Badge label="Non justifié" color={colors.error} bgColor={colors.error + "15"} />
                  )}
                </View>
              ))
            )}
          </>
        )}

        {/* ── BULLETIN ── */}
        {tab === "bulletin" && (
          <>
            {bulletinQ.isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : bulletinQ.isError ? (
              <ErrorView message="Impossible de charger le bulletin" onRetry={() => bulletinQ.refetch()} />
            ) : !bulletinQ.data ? (
              <EmptyState icon="📄" title="Bulletin indisponible" subtitle={`Aucun bulletin au trimestre ${trimestre}.`} />
            ) : (() => {
              const b = bulletinQ.data;
              const moy = b.moyenneGenerale;
              const moyColor = gradeColor(moy, colors);
              const allModules = [
                ...b.domaines.flatMap((d) => d.modules),
                ...b.modulesHorsDomaine,
              ];
              return (
                <>
                  {/* Header moyenne + rang */}
                  <View style={{
                    backgroundColor: moyColor + "12", borderRadius: 18, padding: spacing.lg,
                    borderWidth: 1.5, borderColor: moyColor + "30",
                    alignItems: "center", marginBottom: spacing.md,
                  }}>
                    <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 }}>
                      MOYENNE GÉNÉRALE — T{b.trimestre}
                    </Text>
                    <Text style={{ fontSize: 42, fontWeight: "900", color: moyColor, marginTop: 4 }}>
                      {moy != null ? moy.toFixed(2) : "—"}
                    </Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>/20</Text>
                    {b.rang != null && b.totalEleves != null && (
                      <Text style={{ fontSize: fontSize.sm, color: colors.text, fontWeight: "700", marginTop: spacing.sm }}>
                        Rang : {b.rang} / {b.totalEleves}
                      </Text>
                    )}
                    {b.moyenneClasse != null && (
                      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 }}>
                        Moyenne classe : {b.moyenneClasse.toFixed(2)}
                        {b.moyenneMin != null ? ` · min ${b.moyenneMin.toFixed(2)}` : ""}
                        {b.moyenneMax != null ? ` · max ${b.moyenneMax.toFixed(2)}` : ""}
                      </Text>
                    )}
                  </View>

                  {/* Modules list */}
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
                    MATIÈRES ({allModules.length})
                  </Text>
                  <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}>
                    {allModules.map((m, i) => {
                      const c = gradeColor(m.moyenne, colors);
                      return (
                        <View
                          key={m.moduleId}
                          style={{
                            flexDirection: "row", alignItems: "center", paddingVertical: 10,
                            borderBottomWidth: i < allModules.length - 1 ? 1 : 0,
                            borderBottomColor: colors.border,
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                              {m.moduleName}
                            </Text>
                            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                              {m.coefficient != null ? `Coeff. ${m.coefficient}` : ""}
                              {m.moyenneClasse != null ? `  ·  classe ${m.moyenneClasse.toFixed(1)}` : ""}
                            </Text>
                          </View>
                          <View style={{
                            paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10,
                            backgroundColor: c + "15",
                          }}>
                            <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: c }}>
                              {m.moyenne != null ? m.moyenne.toFixed(2) : "—"}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {b.comportement ? (
                    <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, marginTop: spacing.md, ...shadows.soft }}>
                      <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: 6 }}>
                        COMPORTEMENT
                      </Text>
                      <Text style={{ fontSize: fontSize.sm, color: colors.text }}>{b.comportement}</Text>
                    </View>
                  ) : null}
                </>
              );
            })()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
