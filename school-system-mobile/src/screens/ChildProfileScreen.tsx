import { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { parentPortalApi, type FullProfilePayload } from "@/api/parent-portal.api";
import { useChild } from "@/context/ChildContext";
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

function frDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [, m, d] = iso.split("T")[0].split("-");
  const y = iso.slice(0, 4);
  return `${d}/${m}/${y}`;
}

function colorForMoyenne(m: number | null | undefined, palette: { success: string; warning: string; error: string; textMuted: string }): string {
  if (m == null) return palette.textMuted;
  if (m >= 14) return palette.success;
  if (m >= 10) return palette.warning;
  return palette.error;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + "60",
      }}
    >
      <Text style={{ flex: 1, fontSize: fontSize.xs, color: colors.textSecondary }}>{label}</Text>
      <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{value}</Text>
    </View>
  );
}

/** MOB-FUNC-010 — profil enfant complet avec bulletin courant + classement. */
export default function ChildProfileScreen() {
  const { colors } = useTheme();
  const { selectedChild } = useChild();
  const [trimestre, setTrimestre] = useState("1");

  const q = useQuery({
    queryKey: ["child-full-profile", selectedChild?.id, trimestre],
    queryFn: () => parentPortalApi.getFullProfile(selectedChild!.id, Number(trimestre)),
    enabled: !!selectedChild?.id,
  });

  if (!selectedChild) {
    return <EmptyState icon="👶" title="Aucun enfant" subtitle="Sélectionnez d'abord un enfant." />;
  }
  if (q.isLoading) return <DashboardSkeleton chartCount={2} />;
  if (q.isError) return <ErrorView onRetry={() => q.refetch()} />;

  const p: FullProfilePayload | undefined = q.data;
  if (!p) return <EmptyState icon="❓" title="Pas de profil" subtitle="Aucune information disponible." />;

  const moyenneColor = colorForMoyenne(p.moyenneTrimestre, colors);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={<RefreshControl refreshing={q.isFetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}
      >
        <GradientHeader
          subtitle="Profil de l'élève"
          title={`${p.firstName} ${p.lastName}`}
          extraBottomPadding={20}
        />

        <View style={{ padding: spacing.lg }}>
          <SegmentedControl options={TRIMESTRES} value={trimestre} onChange={setTrimestre} />

          {/* Hero classement + moyenne */}
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginTop: spacing.lg,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                alignItems: "center",
                ...shadows.soft,
              }}
            >
              <Text style={{ fontSize: 22 }}>🏅</Text>
              <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.primary, marginTop: 4 }}>
                {p.rangClasse ? `${p.rangClasse}${p.rangClasse === 1 ? "er" : "e"}` : "—"}
              </Text>
              <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, textAlign: "center" }}>
                {p.effectifClasse ? `sur ${p.effectifClasse} élèves` : "Pas de classement"}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                alignItems: "center",
                ...shadows.soft,
              }}
            >
              <Text style={{ fontSize: 22 }}>📊</Text>
              <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: moyenneColor, marginTop: 4 }}>
                {p.moyenneTrimestre != null ? p.moyenneTrimestre.toFixed(1) : "—"}
              </Text>
              <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, textAlign: "center" }}>
                /20 — moyenne trim.
              </Text>
            </View>
          </View>

          {/* Infos administratives */}
          <Text style={{ marginTop: spacing.xl, marginBottom: spacing.sm, fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1 }}>
            INFORMATIONS
          </Text>
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              ...shadows.soft,
            }}
          >
            <InfoRow label="Matricule" value={p.matricule ?? "—"} />
            <InfoRow label="Classe" value={`${p.niveau ?? ""} ${p.classe ?? ""}`.trim() || "—"} />
            <InfoRow label="Sexe" value={p.sexe === "M" ? "Masculin" : p.sexe === "F" ? "Féminin" : "—"} />
            <InfoRow label="Date de naissance" value={frDate(p.dateOfBirth)} />
            <InfoRow label="Inscrit le" value={frDate(p.enrollmentDate)} />
            <InfoRow label="Statut" value={p.status ?? "—"} />
          </View>

          {/* Bulletin courant */}
          <Text style={{ marginTop: spacing.xl, marginBottom: spacing.sm, fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1 }}>
            BULLETIN — TRIMESTRE {trimestre}
          </Text>
          {!p.currentBulletin ? (
            <View
              style={{
                backgroundColor: colors.background,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                ...shadows.soft,
              }}
            >
              <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center" }}>
                Bulletin pas encore disponible pour ce trimestre.
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: colors.background,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                ...shadows.soft,
              }}
            >
              {(p.currentBulletin.lignes ?? []).map((l: any, i: number) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: spacing.xs,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border + "60",
                  }}
                >
                  <View style={{ flex: 2 }}>
                    <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                      {l.moduleName ?? l.module ?? "?"}
                    </Text>
                    {l.appreciation && (
                      <Text numberOfLines={2} style={{ fontSize: 10, color: colors.textMuted, fontStyle: "italic" }}>
                        {l.appreciation}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      width: 56,
                      textAlign: "right",
                      fontSize: fontSize.sm,
                      fontWeight: "700",
                      color: colorForMoyenne(l.moyenne, colors),
                    }}
                  >
                    {l.moyenne != null ? Number(l.moyenne).toFixed(1) : "—"}
                  </Text>
                </View>
              ))}
              {p.currentBulletin.moyenneGenerale != null && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: spacing.sm,
                    marginTop: spacing.xs,
                    borderTopWidth: 2,
                    borderTopColor: colors.primary + "40",
                  }}
                >
                  <Text style={{ flex: 1, fontSize: fontSize.sm, fontWeight: "800", color: colors.text }}>
                    Moyenne générale
                  </Text>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colorForMoyenne(p.currentBulletin.moyenneGenerale, colors) }}>
                    {Number(p.currentBulletin.moyenneGenerale).toFixed(2)}/20
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
