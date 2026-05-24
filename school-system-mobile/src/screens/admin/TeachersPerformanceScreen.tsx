import { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { adminApi, type TeacherPerformance } from "@/api/admin.api";
import { useSchoolYear } from "@/context/SchoolYearContext";
import { GradientHeader } from "@/components/GradientHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
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

function colorForSaisie(pct: number, palette: { success: string; warning: string; error: string }): string {
  if (pct >= 90) return palette.success;
  if (pct >= 50) return palette.warning;
  return palette.error;
}

/**
 * MOB-FUNC-033 — tableau de performance des enseignants pour un trimestre donné.
 */
export default function TeachersPerformanceScreen() {
  const { colors } = useTheme();
  const { year } = useSchoolYear();
  const [trimestre, setTrimestre] = useState("1");

  const q = useQuery({
    queryKey: ["admin", "teachers-performance", year, trimestre],
    queryFn: () => adminApi.getTeachersPerformance(year, Number(trimestre)),
  });

  if (q.isLoading) return <DashboardSkeleton chartCount={1} />;
  if (q.isError) return <ErrorView onRetry={() => q.refetch()} />;

  const data: TeacherPerformance[] = q.data ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl refreshing={q.isFetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />
        }
      >
        <GradientHeader subtitle="Performance enseignants" title={year} extraBottomPadding={20} />

        <View style={{ padding: spacing.lg }}>
          <SegmentedControl options={TRIMESTRES} value={trimestre} onChange={setTrimestre} />

          {data.length === 0 ? (
            <View style={{ marginTop: spacing.xl }}>
              <EmptyState icon="👥" title="Aucun enseignant" subtitle="Aucune donnée disponible." />
            </View>
          ) : (
            <View
              style={{
                marginTop: spacing.lg,
                backgroundColor: colors.background,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                ...shadows.soft,
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  paddingBottom: spacing.sm,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ flex: 2, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted }}>
                  Enseignant
                </Text>
                <Text style={{ flex: 0.7, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, textAlign: "right" }}>
                  Classes
                </Text>
                <Text style={{ flex: 0.9, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, textAlign: "right" }}>
                  Saisies
                </Text>
                <Text style={{ flex: 0.9, fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, textAlign: "right" }}>
                  Moy donnée
                </Text>
              </View>

              {data.map((t, i) => (
                <View
                  key={t.teacherId}
                  style={{
                    flexDirection: "row",
                    paddingVertical: spacing.sm,
                    borderBottomWidth: i < data.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border + "60",
                  }}
                >
                  <View style={{ flex: 2 }}>
                    <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                      {t.prenom} {t.nom}
                    </Text>
                    <Text style={{ fontSize: 10, color: colors.textMuted }}>
                      {t.nbDevoirs} devoir{t.nbDevoirs > 1 ? "s" : ""} publié{t.nbDevoirs > 1 ? "s" : ""}
                    </Text>
                  </View>
                  <Text style={{ flex: 0.7, fontSize: fontSize.sm, fontWeight: "700", color: colors.text, textAlign: "right" }}>
                    {t.nbClasses}
                  </Text>
                  <Text
                    style={{
                      flex: 0.9,
                      fontSize: fontSize.sm,
                      fontWeight: "800",
                      color: colorForSaisie(t.saisiesAJour, colors),
                      textAlign: "right",
                    }}
                  >
                    {t.saisiesAJour.toFixed(0)}%
                  </Text>
                  <Text style={{ flex: 0.9, fontSize: fontSize.sm, fontWeight: "700", color: colors.text, textAlign: "right" }}>
                    {t.moyenneDonnee > 0 ? t.moyenneDonnee.toFixed(1) : "—"}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.md, textAlign: "center" }}>
            % "saisies" = examens du trimestre avec au moins une note saisie.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
