import { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "@/api/teacher.api";
import { attendanceApi, type AbsenceRequest } from "@/api/attendance.api";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Badge } from "@/components/ui/Badge";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { hhmm, toISODate } from "@/constants/calendar";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";
import type { TeacherClassesStackParamList } from "@/types/teacher";

type AttendanceRoute = RouteProp<TeacherClassesStackParamList, "Attendance">;
type Status = "PRESENT" | "ABSENCE" | "RETARD";

const STATUS_OPTIONS = [
  { value: "PRESENT", label: "Présent", color: colors.success },
  { value: "ABSENCE", label: "Absent", color: colors.error },
  { value: "RETARD", label: "Retard", color: colors.warning },
];

function statusBadge(type: string) {
  return type === "RETARD"
    ? { label: "Retard", color: colors.warning, bg: colors.warning + "15" }
    : { label: "Absent", color: colors.error, bg: colors.error + "15" };
}

export default function AttendanceScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<AttendanceRoute>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const [date, setDate] = useState(new Date());
  const [seance, setSeance] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<string, Status>>({});

  const isoDate = toISODate(date);

  const creneauxQ = useQuery({ queryKey: ["teacher", "creneaux"], queryFn: teacherApi.getCreneaux });
  const studentsQ = useQuery({
    queryKey: ["teacher", "students", params.niveauName, params.letter],
    queryFn: () => teacherApi.getStudents(params.niveauName, params.letter),
  });
  const absencesQ = useQuery({
    queryKey: ["attendance", params.classeId, isoDate],
    queryFn: () => attendanceApi.getByClasseAndDate(params.classeId, isoDate),
  });

  const students = studentsQ.data?.content ?? [];
  const creneaux = creneauxQ.data ?? [];

  // Absences already recorded for the selected séance, keyed by student.
  const existingByStudent = useMemo(() => {
    const map = new Map<string, string>();
    if (seance) {
      for (const a of absencesQ.data ?? []) {
        if (a.seance === seance) map.set(a.eleveId, a.type);
      }
    }
    return map;
  }, [absencesQ.data, seance]);

  // Reset the working marks whenever the date or séance changes.
  useEffect(() => { setMarks({}); }, [isoDate, seance]);

  const mutation = useMutation({
    mutationFn: (payload: AbsenceRequest[]) => attendanceApi.batchCreate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", params.classeId, isoDate] });
      Alert.alert("Appel enregistré", "Les absences ont été enregistrées.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    },
    onError: (e: unknown) =>
      Alert.alert("Erreur", e instanceof Error ? e.message : "Échec de l'enregistrement."),
  });

  const shiftDate = (days: number) => {
    setDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + days);
      return next;
    });
  };

  const handleSave = () => {
    if (!seance) return;
    const payload: AbsenceRequest[] = [];
    for (const s of students) {
      if (existingByStudent.has(s.id)) continue; // already recorded — read-only here
      const status = marks[s.id] ?? "PRESENT";
      if (status === "PRESENT") continue;
      payload.push({ eleveId: s.id, date: isoDate, type: status, seance, justifie: false });
    }
    if (payload.length === 0) {
      Alert.alert("Rien à enregistrer", "Aucune nouvelle absence à enregistrer pour cette séance.");
      return;
    }
    mutation.mutate(payload);
  };

  if (studentsQ.isLoading || creneauxQ.isLoading) return <ListSkeleton count={6} avatar={false} trailing={false} />;
  if (studentsQ.isError) return <ErrorView onRetry={() => studentsQ.refetch()} />;

  const dateLabel = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const newAbsentCount = students.filter(
    (s) => !existingByStudent.has(s.id) && (marks[s.id] ?? "PRESENT") !== "PRESENT",
  ).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        {/* Date stepper */}
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.sm, marginBottom: spacing.md,
        }}>
          <TouchableOpacity onPress={() => shiftDate(-1)} style={{ padding: spacing.sm }}>
            <Text style={{ fontSize: fontSize.lg, color: colors.primary, fontWeight: "800" }}>‹</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, textTransform: "capitalize" }}>
            {dateLabel}
          </Text>
          <TouchableOpacity onPress={() => shiftDate(1)} style={{ padding: spacing.sm }}>
            <Text style={{ fontSize: fontSize.lg, color: colors.primary, fontWeight: "800" }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Séance picker */}
        <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.text, marginBottom: 6 }}>SÉANCE</Text>
        {creneaux.length === 0 ? (
          <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.md }}>
            Aucune séance configurée.
          </Text>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg }}>
            {creneaux.map((c) => {
              const active = c.label === seance;
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setSeance(c.label)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 8, borderRadius: borderRadius.md,
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderWidth: 1, borderColor: active ? colors.primary : colors.border,
                  }}
                >
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: active ? "#fff" : colors.text }}>
                    {c.label}
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: active ? "rgba(255,255,255,0.8)" : colors.textMuted }}>
                    {hhmm(c.heureDebut)} – {hhmm(c.heureFin)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Roster */}
        {!seance ? (
          <EmptyState icon="🕐" title="Choisissez une séance" subtitle="Sélectionnez la séance pour faire l'appel." />
        ) : students.length === 0 ? (
          <EmptyState icon="👥" title="Aucun élève" subtitle="Cette classe n'a aucun élève inscrit." />
        ) : (
          students.map((s) => {
            const existing = existingByStudent.get(s.id);
            return (
              <View key={s.id} style={{ marginBottom: spacing.md }}>
                <Text style={{ fontSize: fontSize.md, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
                  {s.firstName} {s.lastName}
                </Text>
                {existing ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    {(() => { const b = statusBadge(existing); return <Badge label={b.label} color={b.color} bgColor={b.bg} />; })()}
                    <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>déjà enregistré</Text>
                  </View>
                ) : (
                  <SegmentedControl
                    options={STATUS_OPTIONS}
                    value={marks[s.id] ?? "PRESENT"}
                    onChange={(v) => setMarks((prev) => ({ ...prev, [s.id]: v as Status }))}
                  />
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Save footer */}
      {seance && students.length > 0 && (
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
                Enregistrer l'appel{newAbsentCount > 0 ? ` (${newAbsentCount})` : ""}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
