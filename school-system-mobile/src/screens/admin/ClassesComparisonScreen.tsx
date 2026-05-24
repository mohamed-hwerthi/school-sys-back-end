import { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { reportingApi, type ClassStats } from "@/api/reporting.api";
import { GradientHeader } from "@/components/GradientHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { HorizontalBars } from "@/components/charts/HorizontalBars";
import { ChartCard } from "@/components/ChartCard";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { useRoute } from "@react-navigation/native";
import { spacing, fontSize } from "@/constants/theme";

const TRIMESTRES = [
  { value: "1", label: "T1" },
  { value: "2", label: "T2" },
  { value: "3", label: "T3" },
];

/**
 * MOB-FUNC-030 — comparaison des classes d'un même niveau pour un trimestre.
 * Reçoit `niveauName` en route param (ex: "6ème").
 */
export default function ClassesComparisonScreen() {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const niveauName = (route.params?.niveauName as string) ?? "";
  const [trimestre, setTrimestre] = useState("1");

  const q = useQuery({
    queryKey: ["niveau-comparison", niveauName, trimestre],
    queryFn: () => reportingApi.getClassesComparison(niveauName, Number(trimestre)),
    enabled: !!niveauName,
  });

  if (q.isLoading) return <DashboardSkeleton chartCount={3} />;
  if (q.isError) return <ErrorView onRetry={() => q.refetch()} />;

  const stats: ClassStats[] = q.data ?? [];

  const moyenneBars = stats.map((c) => ({
    label: c.classeName,
    value: c.moyenne,
    color:
      c.moyenne >= 14 ? colors.success :
      c.moyenne >= 10 ? colors.warning :
      colors.error,
  }));
  const reussiteBars = stats.map((c) => ({
    label: c.classeName,
    value: c.tauxReussite,
    color:
      c.tauxReussite >= 70 ? colors.success :
      c.tauxReussite >= 50 ? colors.warning :
      colors.error,
  }));
  const presenceBars = stats.map((c) => ({
    label: c.classeName,
    value: c.tauxPresence,
    color:
      c.tauxPresence >= 95 ? colors.success :
      c.tauxPresence >= 85 ? colors.warning :
      colors.error,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl refreshing={q.isFetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />
        }
      >
        <GradientHeader
          subtitle="Comparaison classes"
          title={niveauName}
          extraBottomPadding={20}
        />

        <View style={{ padding: spacing.lg }}>
          <SegmentedControl options={TRIMESTRES} value={trimestre} onChange={setTrimestre} />

          {stats.length === 0 ? (
            <View style={{ marginTop: spacing.xl }}>
              <EmptyState icon="🏫" title="Aucune classe" subtitle={`Aucune classe trouvée pour le niveau "${niveauName}".`} />
            </View>
          ) : (
            <>
              <ChartCard title="Moyenne générale" subtitle="/20 par classe">
                <HorizontalBars data={moyenneBars} formatValue={(v) => v.toFixed(1)} />
              </ChartCard>
              <ChartCard title="Taux de réussite" subtitle="% élèves avec moyenne ≥ 10">
                <HorizontalBars data={reussiteBars} formatValue={(v) => `${v.toFixed(0)}%`} />
              </ChartCard>
              <ChartCard title="Taux de présence" subtitle="% sur le trimestre">
                <HorizontalBars data={presenceBars} formatValue={(v) => `${v.toFixed(1)}%`} />
              </ChartCard>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
