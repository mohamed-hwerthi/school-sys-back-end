import { useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  reportingApi,
  type GradeDistribution,
  type TrimestreEvolution,
  type TopFlop,
  type StudentRank,
  type StudentStats,
} from "@/api/reporting.api";
import { GradientHeader } from "@/components/GradientHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { HorizontalBars } from "@/components/charts/HorizontalBars";
import { ChartCard } from "@/components/ChartCard";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";

const TRIMESTRES = [
  { value: "1", label: "T1" },
  { value: "2", label: "T2" },
  { value: "3", label: "T3" },
];

function colorForMoyenne(moyenne: number, palette: { success: string; warning: string; error: string }): string {
  if (moyenne >= 14) return palette.success;
  if (moyenne >= 10) return palette.warning;
  return palette.error;
}

interface RankRowProps {
  rank: StudentRank;
  highlight: "top" | "flop";
  onPress?: () => void;
}

function RankRow({ rank, highlight, onPress }: RankRowProps) {
  const { colors } = useTheme();
  const c = highlight === "top" ? colors.success : colors.error;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + "60",
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: c + "15",
          justifyContent: "center",
          alignItems: "center",
          marginRight: spacing.sm,
        }}
      >
        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: c }}>#{rank.rang}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
          {rank.prenom} {rank.nom}
        </Text>
      </View>
      <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: c }}>
        {rank.moyenne.toFixed(1)}
      </Text>
    </TouchableOpacity>
  );
}

export default function ClassStatsDetailScreen() {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const classeId = route.params?.classeId as string;
  const classeName = (route.params?.classeName as string) ?? "Classe";

  const [trimestre, setTrimestre] = useState("1");
  const trimestreInt = Number(trimestre);

  const distQ = useQuery({
    queryKey: ["class-drill", classeId, "distribution", trimestreInt],
    queryFn: () => reportingApi.getGradeDistribution(classeId, trimestreInt),
    enabled: !!classeId,
  });

  const evolQ = useQuery({
    queryKey: ["class-drill", classeId, "evolution"],
    queryFn: () => reportingApi.getTrimestreEvolution(classeId),
    enabled: !!classeId,
  });

  const tfQ = useQuery({
    queryKey: ["class-drill", classeId, "top-flop", trimestreInt],
    queryFn: () => reportingApi.getTopFlop(classeId, trimestreInt, 5),
    enabled: !!classeId,
  });

  // MOB-FUNC-029 — liste complète des élèves
  const studentsQ = useQuery({
    queryKey: ["class-drill", classeId, "students", trimestreInt],
    queryFn: () => reportingApi.getClassStudentsStats(classeId, trimestreInt),
    enabled: !!classeId,
  });

  const refreshing = distQ.isFetching || evolQ.isFetching || tfQ.isFetching || studentsQ.isFetching;
  const onRefresh = () => {
    distQ.refetch();
    evolQ.refetch();
    tfQ.refetch();
    studentsQ.refetch();
  };

  if (distQ.isLoading && evolQ.isLoading && tfQ.isLoading) {
    return <DashboardSkeleton chartCount={2} />;
  }
  if (distQ.isError || evolQ.isError || tfQ.isError) {
    return <ErrorView onRetry={onRefresh} />;
  }

  const distribution: GradeDistribution | undefined = distQ.data;
  const evolution: TrimestreEvolution | undefined = evolQ.data;
  const topFlop: TopFlop | undefined = tfQ.data;

  const distributionData =
    distribution?.buckets.map((b) => ({
      label: b.range,
      value: b.count,
      color:
        b.range === "0-5" ? colors.error :
        b.range === "5-10" ? colors.warning :
        b.range === "10-15" ? colors.info :
        colors.success,
    })) ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <GradientHeader
          subtitle="Statistiques détaillées"
          title={classeName}
          extraBottomPadding={20}
        />

        <View style={{ padding: spacing.lg }}>
          <SegmentedControl
            value={trimestre}
            onChange={setTrimestre}
            options={TRIMESTRES}
          />

          {/* MOB-FUNC-016 — distribution */}
          <ChartCard title="Distribution des notes" subtitle={`${distribution?.totalNotes ?? 0} notes ce trimestre`}>
            {distributionData.every((d) => d.value === 0) ? (
              <EmptyState icon="📊" title="Aucune note" subtitle="Pas de données pour ce trimestre" />
            ) : (
              <HorizontalBars data={distributionData} formatValue={(v) => `${v}`} />
            )}
          </ChartCard>

          {/* MOB-FUNC-017 — évolution */}
          <ChartCard title="Évolution trimestrielle" subtitle="Moyenne classe vs moyenne école">
            <View style={{ gap: spacing.sm }}>
              {evolution?.points.map((p) => {
                const empty = p.moyenne === 0;
                const ratio = empty ? 0 : Math.min(p.moyenne / 20, 1);
                const refRatio = Math.min(p.moyenneEcole / 20, 1);
                const c = colorForMoyenne(p.moyenne, colors);
                return (
                  <View key={p.trimestre}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                      <Text style={{ width: 36, fontSize: fontSize.xs, color: colors.textSecondary }}>
                        T{p.trimestre}
                      </Text>
                      <Text style={{ flex: 1, fontSize: fontSize.xs, color: colors.textMuted }}>
                        École : {p.moyenneEcole.toFixed(1)}
                      </Text>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: empty ? colors.textMuted : c }}>
                        {empty ? "—" : p.moyenne.toFixed(1)}
                      </Text>
                    </View>
                    <View style={{ position: "relative", height: 12, backgroundColor: colors.border + "40", borderRadius: 6, overflow: "hidden" }}>
                      <View
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: `${ratio * 100}%`,
                          height: "100%",
                          backgroundColor: c,
                          borderRadius: 6,
                        }}
                      />
                      <View
                        style={{
                          position: "absolute",
                          left: `${refRatio * 100}%`,
                          top: -2,
                          width: 2,
                          height: 16,
                          backgroundColor: colors.text,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 }}>
                Le trait vertical indique la moyenne école comparée.
              </Text>
            </View>
          </ChartCard>

          {/* MOB-FUNC-018 — top/flop */}
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              ...shadows.soft,
            }}
          >
            <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.text, marginBottom: spacing.sm }}>
              🏆 Top 5
            </Text>
            {(!topFlop || topFlop.top.length === 0) ? (
              <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center", paddingVertical: spacing.sm }}>
                Pas assez de notes ce trimestre
              </Text>
            ) : (
              topFlop.top.map((r) => (
                <RankRow
                  key={r.studentId}
                  rank={r}
                  highlight="top"
                  onPress={() => navigation.navigate("TeacherStudentDetail", { studentId: r.studentId })}
                />
              ))
            )}

            {topFlop && topFlop.flop.length > 0 && (
              <>
                <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm }}>
                  ⚠️ À soutenir
                </Text>
                {topFlop.flop.map((r) => (
                  <RankRow
                    key={r.studentId}
                    rank={r}
                    highlight="flop"
                    onPress={() => navigation.navigate("TeacherStudentDetail", { studentId: r.studentId })}
                  />
                ))}
              </>
            )}
          </View>

          {/* MOB-FUNC-029 — tous les élèves */}
          {studentsQ.data && studentsQ.data.length > 0 && (
            <View
              style={{
                backgroundColor: colors.background,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                marginBottom: spacing.lg,
                ...shadows.soft,
              }}
            >
              <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.text, marginBottom: spacing.sm }}>
                👥 Tous les élèves ({studentsQ.data.length})
              </Text>
              <View style={{ flexDirection: "row", paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Text style={{ flex: 2, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted }}>
                  Élève
                </Text>
                <Text style={{ flex: 0.7, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, textAlign: "right" }}>
                  Moy
                </Text>
                <Text style={{ flex: 0.6, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, textAlign: "right" }}>
                  Abs
                </Text>
              </View>
              {studentsQ.data.map((s: StudentStats, i) => (
                <TouchableOpacity
                  key={s.studentId}
                  onPress={() => navigation.navigate("TeacherStudentDetail", { studentId: s.studentId })}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    paddingVertical: spacing.xs,
                    borderBottomWidth: i < (studentsQ.data?.length ?? 0) - 1 ? 1 : 0,
                    borderBottomColor: colors.border + "60",
                  }}
                >
                  <View style={{ flex: 2 }}>
                    <Text numberOfLines={1} style={{ fontSize: fontSize.sm, color: colors.text }}>
                      {s.rang ? `#${s.rang} ` : ""}{s.prenom} {s.nom}
                    </Text>
                    {s.matricule && (
                      <Text style={{ fontSize: 10, color: colors.textMuted }}>{s.matricule}</Text>
                    )}
                  </View>
                  <Text
                    style={{
                      flex: 0.7,
                      fontSize: fontSize.sm,
                      fontWeight: "700",
                      color: s.moyenne === null ? colors.textMuted : colorForMoyenne(s.moyenne, colors),
                      textAlign: "right",
                    }}
                  >
                    {s.moyenne === null ? "—" : s.moyenne.toFixed(1)}
                  </Text>
                  <Text
                    style={{
                      flex: 0.6,
                      fontSize: fontSize.sm,
                      fontWeight: "700",
                      color: s.totalAbsences > 5 ? colors.error : colors.text,
                      textAlign: "right",
                    }}
                  >
                    {s.totalAbsences}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
