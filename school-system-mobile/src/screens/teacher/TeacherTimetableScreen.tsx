import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { teacherApi } from "@/api/teacher.api";
import { GradientHeader } from "@/components/GradientHeader";
import { LessonCard } from "@/components/LessonCard";
import { EmptyState } from "@/components/EmptyState";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { dayLabel, hhmm } from "@/constants/calendar";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize } from "@/constants/theme";
import type { TimetableEntry } from "@/types/teacher";

export default function TeacherTimetableScreen() {
  const { colors } = useTheme();
  const timetableQ = useQuery({ queryKey: ["teacher", "timetable"], queryFn: teacherApi.getMyTimetable });
  const creneauxQ = useQuery({ queryKey: ["teacher", "creneaux"], queryFn: teacherApi.getCreneaux });
  const modulesQ = useQuery({ queryKey: ["teacher", "modules"], queryFn: teacherApi.getModules });
  const classesQ = useQuery({ queryKey: ["teacher", "classes"], queryFn: teacherApi.getClasses });

  if (timetableQ.isLoading) return <DashboardSkeleton chartCount={2} />;
  if (timetableQ.isError) return <ErrorView onRetry={() => timetableQ.refetch()} />;

  const timetable = timetableQ.data ?? [];
  const creneauById = new Map((creneauxQ.data ?? []).map((c) => [c.id, c]));
  const moduleById = new Map((modulesQ.data ?? []).map((m) => [m.id, m]));
  const classeById = new Map((classesQ.data ?? []).map((c) => [c.id, c]));

  // Group lessons by day, each day sorted by start time.
  const byDay = new Map<number, TimetableEntry[]>();
  for (const e of timetable) {
    const list = byDay.get(e.jourSemaine) ?? [];
    list.push(e);
    byDay.set(e.jourSemaine, list);
  }
  const days = [...byDay.keys()].sort((a, b) => a - b);
  for (const list of byDay.values()) {
    list.sort((a, b) =>
      (creneauById.get(a.creneauId)?.heureDebut ?? "").localeCompare(
        creneauById.get(b.creneauId)?.heureDebut ?? "",
      ),
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl refreshing={timetableQ.isFetching} onRefresh={() => timetableQ.refetch()} tintColor={colors.primary} />
        }
      >
        <GradientHeader title="Emploi du temps" subtitle="Votre semaine" />

        <View style={{ padding: spacing.lg }}>
          {days.length === 0 ? (
            <EmptyState icon="🗓️" title="Aucun cours planifié" subtitle="Votre emploi du temps est vide." />
          ) : (
            days.map((day) => (
              <View key={day} style={{ marginBottom: spacing.lg }}>
                <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.primary, marginBottom: spacing.sm }}>
                  {dayLabel(day)}
                </Text>
                {byDay.get(day)!.map((e) => {
                  const cr = creneauById.get(e.creneauId);
                  const mod = e.moduleId ? moduleById.get(e.moduleId) : undefined;
                  const cl = classeById.get(e.classeId);
                  const place = [cl?.fullName, e.salle ? `Salle ${e.salle}` : null].filter(Boolean).join(" · ");
                  return (
                    <LessonCard
                      key={e.id}
                      startTime={hhmm(cr?.heureDebut)}
                      endTime={hhmm(cr?.heureFin)}
                      title={mod?.name ?? "Cours"}
                      subtitle={place}
                    />
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
