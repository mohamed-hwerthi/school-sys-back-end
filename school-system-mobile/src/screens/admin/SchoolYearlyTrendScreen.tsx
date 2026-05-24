import { Dimensions, View, ScrollView, RefreshControl, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { reportingApi } from "@/api/reporting.api";
import { useSchoolYear } from "@/context/SchoolYearContext";
import { GradientHeader } from "@/components/GradientHeader";
import { ChartCard } from "@/components/ChartCard";
import { BarChart } from "@/components/charts/BarChart";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize } from "@/constants/theme";

const CARD_INNER_WIDTH = Dimensions.get("window").width - spacing.lg * 2 - spacing.md * 2;

/**
 * MOB-FUNC-031 — évolution annuelle de l'école : 3 courbes (inscriptions, paiements, absences)
 * sur 12 mois. Réutilise /api/reporting/trends.
 */
export default function SchoolYearlyTrendScreen() {
  const { colors } = useTheme();
  const { year } = useSchoolYear();

  const trendsQ = useQuery({
    queryKey: ["reporting", "yearly-trends", year],
    queryFn: () => reportingApi.getTrends(year),
  });

  if (trendsQ.isLoading) return <DashboardSkeleton chartCount={3} />;
  if (trendsQ.isError) return <ErrorView onRetry={() => trendsQ.refetch()} />;

  const trends = trendsQ.data ?? [];

  const inscriptionsData = trends.map((t) => ({ label: t.month.slice(0, 3), value: t.inscriptions }));
  const paiementsData = trends.map((t) => ({ label: t.month.slice(0, 3), value: t.paiements }));
  const absencesData = trends.map((t) => ({ label: t.month.slice(0, 3), value: t.absences }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl refreshing={trendsQ.isFetching} onRefresh={() => trendsQ.refetch()} tintColor={colors.primary} />
        }
      >
        <GradientHeader
          subtitle="Évolution annuelle"
          title={year}
          extraBottomPadding={20}
        />

        <View style={{ padding: spacing.lg }}>
          {trends.length === 0 ? (
            <EmptyState icon="📈" title="Pas de données" subtitle="Aucune activité sur cette année scolaire." />
          ) : (
            <>
              <ChartCard title="Nouvelles inscriptions" subtitle="Par mois">
                <BarChart data={inscriptionsData} width={CARD_INNER_WIDTH} height={200} color={colors.primary} />
              </ChartCard>
              <ChartCard title="Paiements encaissés" subtitle="Par mois (DT)">
                <BarChart data={paiementsData} width={CARD_INNER_WIDTH} height={200} color={colors.success} />
              </ChartCard>
              <ChartCard title="Absences" subtitle="Par mois">
                <BarChart data={absencesData} width={CARD_INNER_WIDTH} height={200} color={colors.warning} />
              </ChartCard>
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, textAlign: "center", marginTop: spacing.md }}>
                Données agrégées via /api/reporting/trends
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
