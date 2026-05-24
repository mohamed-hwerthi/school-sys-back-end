import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { parentPortalApi, type MatiereProgress } from "@/api/parent-portal.api";
import { useChild } from "@/context/ChildContext";
import { GradientHeader } from "@/components/GradientHeader";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";

/**
 * MOB-FUNC-007 — vue progression : pour chaque matière, T1/T2/T3 + tendance.
 * Pas de lib externe — barres horizontales custom.
 */
function tendanceLabel(t: string): { icon: string; color: (c: any) => string } {
  if (t === "haut") return { icon: "↗", color: (c) => c.success };
  if (t === "bas") return { icon: "↘", color: (c) => c.error };
  return { icon: "→", color: (c) => c.warning };
}

function colorForMoyenne(m: number | null | undefined, palette: { success: string; warning: string; error: string; textMuted: string }): string {
  if (m == null) return palette.textMuted;
  if (m >= 14) return palette.success;
  if (m >= 10) return palette.warning;
  return palette.error;
}

interface TrimestreBarProps {
  label: string;
  value: number | null;
}

function TrimestreBar({ label, value }: TrimestreBarProps) {
  const { colors } = useTheme();
  const empty = value == null;
  const ratio = empty ? 0 : Math.min((value as number) / 20, 1);
  const c = colorForMoyenne(value, colors);
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 3 }}>
      <Text style={{ width: 28, fontSize: 10, color: colors.textSecondary }}>{label}</Text>
      <View
        style={{
          flex: 1,
          height: 6,
          backgroundColor: colors.border + "40",
          borderRadius: 3,
          overflow: "hidden",
          marginHorizontal: 6,
        }}
      >
        <View style={{ width: `${ratio * 100}%`, height: "100%", backgroundColor: c, borderRadius: 3 }} />
      </View>
      <Text style={{ width: 36, textAlign: "right", fontSize: fontSize.xs, fontWeight: "700", color: c }}>
        {empty ? "—" : (value as number).toFixed(1)}
      </Text>
    </View>
  );
}

export default function ChildProgressScreen() {
  const { colors } = useTheme();
  const { selectedChild } = useChild();

  const q = useQuery({
    queryKey: ["child-progress", selectedChild?.id],
    queryFn: () => parentPortalApi.getProgress(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  if (!selectedChild) {
    return <EmptyState icon="👶" title="Aucun enfant" subtitle="Sélectionnez d'abord un enfant." />;
  }
  if (q.isLoading) return <DashboardSkeleton chartCount={3} />;
  if (q.isError) return <ErrorView onRetry={() => q.refetch()} />;

  const matieres: MatiereProgress[] = q.data?.matieres ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={<RefreshControl refreshing={q.isFetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}
      >
        <GradientHeader
          subtitle="Progression"
          title={`${selectedChild.firstName} ${selectedChild.lastName}`}
          extraBottomPadding={20}
        />

        <View style={{ padding: spacing.lg }}>
          {matieres.length === 0 ? (
            <EmptyState icon="📚" title="Pas encore de notes" subtitle="La progression apparaîtra dès la saisie des premières notes." />
          ) : (
            matieres.map((m) => {
              const { icon, color } = tendanceLabel(m.tendance);
              const tc = color(colors);
              return (
                <View
                  key={m.moduleId}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: borderRadius.lg,
                    padding: spacing.md,
                    marginBottom: spacing.md,
                    ...shadows.soft,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}>
                    <Text style={{ flex: 1, fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                      {m.moduleNom}
                    </Text>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: tc }}>{icon}</Text>
                  </View>
                  <TrimestreBar label="T1" value={m.t1} />
                  <TrimestreBar label="T2" value={m.t2} />
                  <TrimestreBar label="T3" value={m.t3} />
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
