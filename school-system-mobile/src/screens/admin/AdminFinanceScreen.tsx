import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSchoolYear } from "@/context/SchoolYearContext";
import { financeApi, type PaiementSummary } from "@/api/finance.api";
import { GradientHeader } from "@/components/GradientHeader";
import { YearPicker } from "@/components/YearPicker";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/EmptyState";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";

function formatMoney(n: number): string {
  return `${Math.round(n).toLocaleString("fr-FR")} DT`;
}

function paiementBadge(p: PaiementSummary) {
  const s = (p.statut ?? "").toUpperCase();
  if (s === "PAYE") return { label: "Payé", color: colors.success, bg: colors.success + "15" };
  if (s === "EN_RETARD") return { label: "En retard", color: colors.error, bg: colors.error + "15" };
  if (s === "PARTIEL") return { label: "Partiel", color: colors.warning, bg: colors.warning + "15" };
  if (s === "EN_ATTENTE") return { label: "En attente", color: colors.textMuted, bg: colors.surfaceHover };
  return { label: p.statut, color: colors.textMuted, bg: colors.surfaceHover };
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

export default function AdminFinanceScreen() {
  const { colors } = useTheme();
  const { year } = useSchoolYear();

  const financeQ = useQuery({ queryKey: ["finance", "dashboard", year], queryFn: () => financeApi.getDashboard(year) });
  const depStatsQ = useQuery({ queryKey: ["finance", "depenses", year], queryFn: () => financeApi.getDepenseStats(year) });
  const paiementsQ = useQuery({ queryKey: ["finance", "paiements-list"], queryFn: () => financeApi.listPaiements({ size: 15 }) });
  const depensesQ = useQuery({ queryKey: ["finance", "depenses-list"], queryFn: () => financeApi.listDepenses({ size: 15 }) });

  if (financeQ.isLoading) return <DashboardSkeleton chartCount={2} />;
  if (financeQ.isError || !financeQ.data) return <ErrorView onRetry={() => financeQ.refetch()} />;

  const fin = financeQ.data;
  const depStats = depStatsQ.data;
  const paiements = paiementsQ.data?.content ?? [];
  const depenses = depensesQ.data?.content ?? [];

  const revenu = fin.totalEncaisse ?? 0;
  const depTotal = depStats?.totalDepenses ?? 0;
  const solde = revenu - depTotal;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl
            refreshing={financeQ.isFetching || depStatsQ.isFetching || paiementsQ.isFetching || depensesQ.isFetching}
            onRefresh={() => { financeQ.refetch(); depStatsQ.refetch(); paiementsQ.refetch(); depensesQ.refetch(); }}
            tintColor={colors.primary}
          />
        }
      >
        <GradientHeader title="Finance" subtitle="Aperçu de l'école" />

        <View style={{ padding: spacing.lg }}>
          {/* Year filter */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
            <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1 }}>
              ANNÉE SCOLAIRE
            </Text>
            <YearPicker />
          </View>

          {/* KPIs */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: spacing.md }}>
            <KpiCard label="Revenu" value={formatMoney(revenu)} color={colors.success} />
            <KpiCard label="Dépenses" value={formatMoney(depTotal)} color={colors.error} />
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: spacing.lg }}>
            <KpiCard label="Solde" value={formatMoney(solde)} color={solde >= 0 ? colors.success : colors.error} />
            <KpiCard label="Impayés" value={formatMoney(fin.totalImpayes ?? 0)} color={colors.warning} />
          </View>

          {/* Status counts */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.xl }}>
            <Badge label={`${fin.paiementsPayes} payés`} color={colors.success} bgColor={colors.success + "15"} />
            <Badge label={`${fin.paiementsEnRetard} en retard`} color={colors.error} bgColor={colors.error + "15"} />
            <Badge label={`${fin.paiementsPartiels} partiels`} color={colors.warning} bgColor={colors.warning + "15"} />
            <Badge label={`${fin.paiementsEnAttente} en attente`} color={colors.textMuted} bgColor={colors.surfaceHover} />
          </View>

          {/* Recent payments */}
          <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
            DERNIERS PAIEMENTS
          </Text>
          {paiementsQ.isLoading ? null : paiements.length === 0 ? (
            <EmptyState icon="💳" title="Aucun paiement" />
          ) : (
            paiements.map((p) => {
              const b = paiementBadge(p);
              return (
                <View key={p.id} style={{
                  flexDirection: "row", alignItems: "center", backgroundColor: colors.background,
                  borderRadius: 14, padding: spacing.md, marginBottom: 8, ...shadows.soft,
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }} numberOfLines={1}>
                      {p.studentFirstName} {p.studentLastName}
                    </Text>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                      {[p.typeFraisNom, p.mois, p.datePaiement].filter(Boolean).join("  ·  ")}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: colors.text }}>
                      {formatMoney(p.montantPaye)}
                    </Text>
                    <View style={{ marginTop: 4 }}>
                      <Badge label={b.label} color={b.color} bgColor={b.bg} />
                    </View>
                  </View>
                </View>
              );
            })
          )}

          {/* Recent expenses */}
          <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginTop: spacing.lg, marginBottom: spacing.sm }}>
            DERNIÈRES DÉPENSES
          </Text>
          {depensesQ.isLoading ? null : depenses.length === 0 ? (
            <EmptyState icon="💸" title="Aucune dépense" />
          ) : (
            depenses.map((d) => (
              <View key={d.id} style={{
                flexDirection: "row", alignItems: "center", backgroundColor: colors.background,
                borderRadius: 14, padding: spacing.md, marginBottom: 8, ...shadows.soft,
              }}>
                <View style={{
                  width: 36, height: 36, borderRadius: 12, backgroundColor: colors.error + "12",
                  justifyContent: "center", alignItems: "center", marginRight: spacing.md,
                }}>
                  <Text style={{ fontSize: 16 }}>💸</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }} numberOfLines={1}>
                    {d.libelle}
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                    {[d.categorieNom, d.fournisseur, d.dateDepense].filter(Boolean).join("  ·  ")}
                  </Text>
                </View>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: colors.error }}>
                  {formatMoney(d.montant)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
