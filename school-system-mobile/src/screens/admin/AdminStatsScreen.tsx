import { useState, useMemo } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { reportingApi, type ClassStats } from "@/api/reporting.api";
import { GradientHeader } from "@/components/GradientHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { StatCard } from "@/components/StatCard";
import { HorizontalBars } from "@/components/charts/HorizontalBars";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, shadows } from "@/constants/theme";

const TRIMESTRES = [
  { value: "1", label: "Trimestre 1" },
  { value: "2", label: "Trimestre 2" },
  { value: "3", label: "Trimestre 3" },
];

function colorForReussite(taux: number, palette: { success: string; warning: string; error: string }): string {
  if (taux >= 70) return palette.success;
  if (taux >= 50) return palette.warning;
  return palette.error;
}

function colorForPresence(taux: number, palette: { success: string; warning: string; error: string }): string {
  if (taux >= 95) return palette.success;
  if (taux >= 85) return palette.warning;
  return palette.error;
}

export default function AdminStatsScreen() {
  const { colors } = useTheme();
  const [trimestre, setTrimestre] = useState("1");

  const statsQ = useQuery({
    queryKey: ["admin", "class-stats", trimestre],
    queryFn: () => reportingApi.getClassStats(Number(trimestre)),
  });

  const stats: ClassStats[] = statsQ.data ?? [];

  const totals = useMemo(() => {
    if (stats.length === 0) {
      return { moyenne: 0, reussite: 0, presence: 0, absences: 0, retards: 0 };
    }
    let moy = 0, reu = 0, pre = 0, abs = 0, ret = 0, withGrades = 0;
    for (const c of stats) {
      if (c.moyenne > 0) { moy += c.moyenne; reu += c.tauxReussite; withGrades++; }
      pre += c.tauxPresence;
      abs += c.totalAbsences;
      ret += c.totalRetards;
    }
    return {
      moyenne: withGrades > 0 ? Math.round((moy / withGrades) * 10) / 10 : 0,
      reussite: withGrades > 0 ? Math.round(reu / withGrades) : 0,
      presence: stats.length > 0 ? Math.round(pre / stats.length) : 0,
      absences: abs,
      retards: ret,
    };
  }, [stats]);

  const topReussite = useMemo(
    () => [...stats].filter((s) => s.moyenne > 0).sort((a, b) => b.moyenne - a.moyenne).slice(0, 3),
    [stats],
  );
  const topAbsenteistes = useMemo(
    () => [...stats].filter((s) => s.totalAbsences > 0).sort((a, b) => b.totalAbsences - a.totalAbsences).slice(0, 3),
    [stats],
  );

  const reussiteBars = useMemo(
    () => stats
      .filter((s) => s.moyenne > 0)
      .sort((a, b) => b.tauxReussite - a.tauxReussite)
      .map((s) => ({
        label: s.classeName,
        value: s.tauxReussite,
        color: colorForReussite(s.tauxReussite, colors),
      })),
    [stats, colors],
  );

  const presenceBars = useMemo(
    () => [...stats]
      .sort((a, b) => a.tauxPresence - b.tauxPresence)
      .map((s) => ({
        label: s.classeName,
        value: s.tauxPresence,
        color: colorForPresence(s.tauxPresence, colors),
      })),
    [stats, colors],
  );

  if (statsQ.isLoading) return <DashboardSkeleton chartCount={2} />;
  if (statsQ.isError) return <ErrorView onRetry={() => statsQ.refetch()} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <GradientHeader title="Stats école" subtitle="Réussite & présence par classe" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl
            refreshing={statsQ.isFetching}
            onRefresh={() => statsQ.refetch()}
            tintColor={colors.primary}
          />
        }
      >
        {/* Trimestre selector */}
        <SegmentedControl options={TRIMESTRES} value={trimestre} onChange={setTrimestre} />

        {stats.length === 0 ? (
          <View style={{ marginTop: spacing.xl }}>
            <EmptyState icon="📊" title="Aucune classe" subtitle="Aucune donnée pour ce trimestre." />
          </View>
        ) : (
          <>
            {/* Top KPIs */}
            <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }}>
              <StatCard
                icon="📊"
                label="Moyenne école"
                value={totals.moyenne > 0 ? totals.moyenne.toFixed(1) : "—"}
                color={colors.primary}
                subtitle="/20"
              />
              <StatCard
                icon="🎯"
                label="Réussite"
                value={`${totals.reussite}%`}
                color={colorForReussite(totals.reussite, colors)}
                subtitle="≥ 10/20"
              />
              <StatCard
                icon="📅"
                label="Présence"
                value={`${totals.presence}%`}
                color={colorForPresence(totals.presence, colors)}
                subtitle={`${totals.absences} abs.`}
              />
            </View>

            {/* Top reussite */}
            {topReussite.length > 0 && (
              <View style={{ marginTop: spacing.xl }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
                  🏆 MEILLEURES CLASSES
                </Text>
                <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}>
                  {topReussite.map((c, i) => (
                    <View
                      key={c.classeId}
                      style={{
                        flexDirection: "row", alignItems: "center", paddingVertical: 8,
                        borderBottomWidth: i < topReussite.length - 1 ? 1 : 0,
                        borderBottomColor: colors.border,
                      }}
                    >
                      <Text style={{ fontSize: fontSize.md, fontWeight: "900", color: colors.success, width: 30 }}>
                        #{i + 1}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                          Classe {c.classeName}
                        </Text>
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                          {c.niveauName} · {c.nbEleves} élèves
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.success }}>
                          {c.moyenne.toFixed(1)}
                        </Text>
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                          {c.tauxReussite.toFixed(0)}% ≥ 10
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Top absenteistes */}
            {topAbsenteistes.length > 0 && (
              <View style={{ marginTop: spacing.lg }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
                  ⚠️ CLASSES À SURVEILLER
                </Text>
                <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}>
                  {topAbsenteistes.map((c, i) => (
                    <View
                      key={c.classeId}
                      style={{
                        flexDirection: "row", alignItems: "center", paddingVertical: 8,
                        borderBottomWidth: i < topAbsenteistes.length - 1 ? 1 : 0,
                        borderBottomColor: colors.border,
                      }}
                    >
                      <Text style={{ fontSize: fontSize.md, fontWeight: "900", color: colors.error, width: 30 }}>
                        #{i + 1}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                          Classe {c.classeName}
                        </Text>
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                          {c.niveauName} · {c.nbEleves} élèves
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.error }}>
                          {c.totalAbsences}
                        </Text>
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                          absences{c.totalRetards > 0 ? ` · ${c.totalRetards} retards` : ""}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Reussite par classe — bar chart */}
            {reussiteBars.length > 0 && (
              <View style={{ marginTop: spacing.xl }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
                  TAUX DE RÉUSSITE PAR CLASSE
                </Text>
                <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}>
                  <HorizontalBars data={reussiteBars} formatValue={(v) => `${v.toFixed(0)}%`} />
                </View>
              </View>
            )}

            {/* Presence par classe — bar chart */}
            {presenceBars.length > 0 && (
              <View style={{ marginTop: spacing.lg }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
                  TAUX DE PRÉSENCE PAR CLASSE
                </Text>
                <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}>
                  <HorizontalBars data={presenceBars} formatValue={(v) => `${v.toFixed(1)}%`} />
                </View>
              </View>
            )}

            {/* Liste compacte */}
            <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginTop: spacing.xl, marginBottom: spacing.sm }}>
              DÉTAIL PAR CLASSE
            </Text>
            <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}>
              <View style={{ flexDirection: "row", paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Text style={{ flex: 1.4, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted }}>Classe</Text>
                <Text style={{ flex: 0.8, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, textAlign: "right" }}>Moy</Text>
                <Text style={{ flex: 0.8, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, textAlign: "right" }}>Réus</Text>
                <Text style={{ flex: 0.8, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, textAlign: "right" }}>Prés</Text>
              </View>
              {stats.map((c, i) => (
                <View
                  key={c.classeId}
                  style={{
                    flexDirection: "row", paddingVertical: 8,
                    borderBottomWidth: i < stats.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                  }}
                >
                  <View style={{ flex: 1.4 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{c.classeName}</Text>
                    <Text style={{ fontSize: 10, color: colors.textMuted }}>{c.niveauName} · {c.nbEleves}él</Text>
                  </View>
                  <Text style={{ flex: 0.8, fontSize: fontSize.sm, fontWeight: "700", color: colors.text, textAlign: "right" }}>
                    {c.moyenne > 0 ? c.moyenne.toFixed(1) : "—"}
                  </Text>
                  <Text style={{ flex: 0.8, fontSize: fontSize.sm, fontWeight: "700", color: colorForReussite(c.tauxReussite, colors), textAlign: "right" }}>
                    {c.moyenne > 0 ? `${c.tauxReussite.toFixed(0)}%` : "—"}
                  </Text>
                  <Text style={{ flex: 0.8, fontSize: fontSize.sm, fontWeight: "700", color: colorForPresence(c.tauxPresence, colors), textAlign: "right" }}>
                    {c.tauxPresence.toFixed(0)}%
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
