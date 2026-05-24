import { View, Text, ScrollView, RefreshControl, Dimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { useSchoolYear } from "@/context/SchoolYearContext";
import { YearPicker } from "@/components/YearPicker";
import { reportingApi } from "@/api/reporting.api";
import { financeApi } from "@/api/finance.api";
import { adminApi } from "@/api/admin.api";
import { AdminKpiGrid } from "@/components/AdminKpiGrid";
import { OperationalAlertsCard } from "@/components/OperationalAlertsCard";
import { GradientHeader } from "@/components/GradientHeader";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { HorizontalBars } from "@/components/charts/HorizontalBars";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, shadows } from "@/constants/theme";

const CARD_INNER_WIDTH = Dimensions.get("window").width - spacing.lg * 2 - spacing.md * 2;

function formatMoney(n: number): string {
  return `${Math.round(n).toLocaleString("fr-FR")} DT`;
}

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}>
      <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color }} numberOfLines={1}>{value}</Text>
      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function LegendDot({ color, label, value }: { color: string; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginRight: 8 }} />
      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, flex: 1 }}>{label}</Text>
      <Text style={{ fontSize: fontSize.xs, color: colors.text, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}

export default function AdminHomeScreen() {
  const { user } = useAuth();
  const { year } = useSchoolYear();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const dashboardQ = useQuery({ queryKey: ["reporting", "dashboard", year], queryFn: () => reportingApi.getDashboard(year) });
  const trendsQ = useQuery({ queryKey: ["reporting", "trends", year], queryFn: () => reportingApi.getTrends(year) });
  const financeQ = useQuery({ queryKey: ["finance", "dashboard", year], queryFn: () => financeApi.getDashboard(year) });
  const depensesQ = useQuery({ queryKey: ["finance", "depenses", year], queryFn: () => financeApi.getDepenseStats(year) });
  // MOB-FUNC-025 — 6 KPI dashboard
  const kpisQ = useQuery({ queryKey: ["admin", "dashboard-kpis", year], queryFn: () => adminApi.getDashboardKpis(year) });
  // MOB-FUNC-028 — operational alerts
  const opAlertsQ = useQuery({ queryKey: ["admin", "operational-alerts", year], queryFn: () => adminApi.getOperationalAlerts(year) });

  if (dashboardQ.isLoading) return <DashboardSkeleton chartCount={3} />;
  if (dashboardQ.isError || !dashboardQ.data) return <ErrorView onRetry={() => dashboardQ.refetch()} />;

  const s = dashboardQ.data;
  const fin = financeQ.data;
  const dep = depensesQ.data;
  const trends = trendsQ.data ?? [];

  const niveauData = Object.entries(s.studentsByNiveau ?? {}).map(([label, value]) => ({ label, value }));
  const weeklyData = (s.weeklyAttendance ?? []).map((d) => ({ label: d.jour.slice(0, 3), value: d.presents }));
  const categoryData = (dep?.parCategorie ?? []).map((c) => ({ label: c.categorieNom, value: c.total }));
  const revenueTrendData = trends.map((t) => ({ label: t.month.slice(0, 3), value: t.paiements }));

  const revenu = fin?.totalEncaisse ?? 0;
  const depenses = dep?.totalDepenses ?? 0;
  const solde = revenu - depenses;
  const impayes = fin?.totalImpayes ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl
            refreshing={dashboardQ.isFetching || financeQ.isFetching || depensesQ.isFetching || trendsQ.isFetching}
            onRefresh={() => { dashboardQ.refetch(); financeQ.refetch(); depensesQ.refetch(); trendsQ.refetch(); kpisQ.refetch(); opAlertsQ.refetch(); }}
            tintColor={colors.primary}
          />
        }
      >
        <GradientHeader
          subtitle="Espace administration"
          title={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
          extraBottomPadding={40}
        />

        {/* Top stats — float over the header */}
        <View style={{ flexDirection: "row", gap: 10, marginHorizontal: spacing.lg, marginTop: -46 }}>
          <StatCard icon="🎓" label="Élèves" value={s.totalStudents} color={colors.primary} />
          <StatCard icon="👥" label="Enseignants" value={s.totalTeachers} color={colors.info} />
          <StatCard icon="🏫" label="Classes" value={s.totalClasses} color={colors.success} />
        </View>

        <View style={{ padding: spacing.lg }}>
          {/* Year filter */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
            <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1 }}>
              ANNÉE SCOLAIRE
            </Text>
            <YearPicker />
          </View>

          {/* MOB-FUNC-025 — 6 KPI dashboard */}
          <AdminKpiGrid data={kpisQ.data} />

          {/* MOB-FUNC-028 — alertes opérationnelles */}
          <OperationalAlertsCard
            data={opAlertsQ.data}
            onPressImpayes={() => navigation.navigate("AdminFinance")}
            onPressAbsentees={() => navigation.navigate("AdminStudents")}
            onPressClasses={() => navigation.navigate("AdminSchool")}
          />

          {/* Pedagogical KPIs */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: spacing.lg }}>
            <KpiCard label="Recouvrement" value={`${Math.round(s.tauxRecouvrement)}%`} color={colors.success} />
            <KpiCard label="Absentéisme" value={`${Math.round(s.tauxAbsence)}%`} color={colors.warning} />
            <KpiCard label="Moyenne /20" value={s.moyenneGenerale.toFixed(1)} color={colors.primary} />
          </View>

          {/* ── Finances ──────────────────────────────────────────── */}
          <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
            FINANCES
          </Text>

          {/* Revenue / expenses / balance */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: spacing.md }}>
            <KpiCard label="Revenu" value={formatMoney(revenu)} color={colors.success} />
            <KpiCard label="Dépenses" value={formatMoney(depenses)} color={colors.error} />
            <KpiCard label="Solde" value={formatMoney(solde)} color={solde >= 0 ? colors.success : colors.error} />
          </View>

          {/* Recovered vs unpaid — donut */}
          {fin && (revenu > 0 || impayes > 0) && (
            <ChartCard title="Recouvré vs impayé">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <DonutChart
                  size={140}
                  centerValue={`${Math.round(fin.tauxRecouvrement)}%`}
                  centerLabel="recouvré"
                  segments={[
                    { label: "Recouvré", value: revenu, color: colors.success },
                    { label: "Impayé", value: impayes, color: colors.error },
                  ]}
                />
                <View style={{ flex: 1, marginLeft: spacing.lg }}>
                  <LegendDot color={colors.success} label="Recouvré" value={formatMoney(revenu)} />
                  <LegendDot color={colors.error} label="Impayé" value={formatMoney(impayes)} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 }}>
                    Dû total : {formatMoney(fin.totalDu)}
                  </Text>
                </View>
              </View>
            </ChartCard>
          )}

          {/* Expenses by category */}
          {categoryData.length > 0 && (
            <ChartCard title="Dépenses par catégorie">
              <HorizontalBars
                data={categoryData}
                formatValue={(v) => formatMoney(v)}
              />
            </ChartCard>
          )}

          {/* Monthly revenue trend */}
          {revenueTrendData.length > 0 && (
            <ChartCard title="Revenu mensuel" subtitle="Paiements encaissés par mois">
              <BarChart data={revenueTrendData} width={CARD_INNER_WIDTH} height={200} color={colors.success} />
            </ChartCard>
          )}

          {/* ── Pédagogique ───────────────────────────────────────── */}
          <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginTop: spacing.md, marginBottom: spacing.sm }}>
            PÉDAGOGIQUE
          </Text>

          {niveauData.length > 0 && (
            <ChartCard title="Élèves par niveau">
              <BarChart data={niveauData} width={CARD_INNER_WIDTH} height={200} color={colors.primary} />
            </ChartCard>
          )}

          {weeklyData.length > 0 && (
            <ChartCard title="Présence de la semaine" subtitle="Élèves présents par jour">
              <BarChart data={weeklyData} width={CARD_INNER_WIDTH} height={200} color={colors.info} />
            </ChartCard>
          )}

          {/* Upcoming events */}
          <SectionHeader title="Événements à venir" />
          {s.upcomingEvents.length === 0 ? (
            <EmptyState icon="📅" title="Aucun événement" subtitle="Rien de prévu prochainement." />
          ) : (
            s.upcomingEvents.map((e) => (
              <View
                key={e.id}
                style={{
                  flexDirection: "row", alignItems: "center", marginBottom: 10,
                  backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, ...shadows.soft,
                }}
              >
                <View style={{
                  width: 10, height: 40, borderRadius: 5,
                  backgroundColor: e.couleur || colors.primary, marginRight: spacing.md,
                }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }} numberOfLines={1}>
                    {e.titre}
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                    {[e.dateDebut, e.lieu].filter(Boolean).join("  ·  ")}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
