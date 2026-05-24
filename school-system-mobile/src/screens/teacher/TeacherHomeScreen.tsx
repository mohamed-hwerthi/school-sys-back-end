import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { teacherApi } from "@/api/teacher.api";
import { GradientHeader } from "@/components/GradientHeader";
import { StatCard } from "@/components/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LessonCard } from "@/components/LessonCard";
import { EmptyState } from "@/components/EmptyState";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { PendingCorrectionsCard } from "@/components/PendingCorrectionsCard";
import { StudentsAtRiskCard } from "@/components/StudentsAtRiskCard";
import { PendingTasksCard } from "@/components/PendingTasksCard";
import { dayLabel, hhmm, todayJourSemaine } from "@/constants/calendar";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing } from "@/constants/theme";

const TODAY = todayJourSemaine();

export default function TeacherHomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const classesQ = useQuery({ queryKey: ["teacher", "classes"], queryFn: teacherApi.getClasses });
  const timetableQ = useQuery({ queryKey: ["teacher", "timetable"], queryFn: teacherApi.getMyTimetable });
  const creneauxQ = useQuery({ queryKey: ["teacher", "creneaux"], queryFn: teacherApi.getCreneaux });
  const modulesQ = useQuery({ queryKey: ["teacher", "modules"], queryFn: teacherApi.getModules });

  // MOB-FUNC-012 — devoirs/quiz à corriger
  const pendingQ = useQuery({
    queryKey: ["teacher", "pending-corrections"],
    queryFn: teacherApi.getPendingCorrections,
  });
  // MOB-FUNC-013 — élèves à surveiller
  const atRiskQ = useQuery({
    queryKey: ["teacher", "students-at-risk"],
    queryFn: () => teacherApi.getStudentsAtRisk(5),
  });
  // MOB-FUNC-014 — saisies en retard
  const tasksQ = useQuery({
    queryKey: ["teacher", "pending-tasks"],
    queryFn: teacherApi.getPendingTasks,
  });

  // Only the core data blocks the screen; module/créneau labels degrade gracefully.
  if (classesQ.isLoading || timetableQ.isLoading) return <DashboardSkeleton chartCount={1} />;
  if (classesQ.isError || timetableQ.isError) {
    return <ErrorView onRetry={() => { classesQ.refetch(); timetableQ.refetch(); }} />;
  }

  const classes = classesQ.data ?? [];
  const timetable = timetableQ.data ?? [];
  const creneaux = creneauxQ.data ?? [];
  const modules = modulesQ.data ?? [];

  const creneauById = new Map(creneaux.map((c) => [c.id, c]));
  const moduleById = new Map(modules.map((m) => [m.id, m]));
  const classeById = new Map(classes.map((c) => [c.id, c]));

  const todayEntries = timetable
    .filter((e) => e.jourSemaine === TODAY)
    .sort((a, b) =>
      (creneauById.get(a.creneauId)?.heureDebut ?? "").localeCompare(
        creneauById.get(b.creneauId)?.heureDebut ?? "",
      ),
    );

  const refreshing = classesQ.isFetching || timetableQ.isFetching;
  const onRefresh = () => {
    classesQ.refetch();
    timetableQ.refetch();
    creneauxQ.refetch();
    modulesQ.refetch();
    pendingQ.refetch();
    atRiskQ.refetch();
    tasksQ.refetch();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <GradientHeader
          subtitle="Bonjour 👋"
          title={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
          extraBottomPadding={40}
        />

        {/* Stats — float over the header edge */}
        <View style={{ flexDirection: "row", gap: 10, marginHorizontal: spacing.lg, marginTop: -46 }}>
          <StatCard icon="🏫" label="Mes classes" value={classes.length} color={colors.primary} />
          <StatCard icon="📅" label="Aujourd'hui" value={todayEntries.length} color={colors.info} />
          <StatCard icon="🗓️" label="Cette semaine" value={timetable.length} color={colors.success} />
        </View>

        {/* Sprint A — cartes enrichies */}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
          <PendingCorrectionsCard
            data={pendingQ.data}
            onPressDevoirs={() => navigation.navigate("TeacherDevoirsTab")}
            onPressQuiz={() => navigation.navigate("TeacherDevoirsTab")}
          />
          <StudentsAtRiskCard
            data={atRiskQ.data}
            onPressStudent={(s) =>
              navigation.navigate("TeacherStudentDetail", { studentId: s.studentId })
            }
          />
          <PendingTasksCard
            data={tasksQ.data}
            onPressAction={() => navigation.navigate("TeacherClassesTab")}
          />
        </View>

        {/* Today's lessons */}
        <View style={{ padding: spacing.lg }}>
          <SectionHeader title={`Aujourd'hui — ${dayLabel(TODAY)}`} />
          {todayEntries.length === 0 ? (
            <EmptyState icon="☕" title="Aucun cours aujourd'hui" subtitle="Profitez de votre journée !" />
          ) : (
            todayEntries.map((e) => {
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
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
