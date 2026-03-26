import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback, useMemo } from "react";
import { useChild } from "@/context/ChildContext";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { disciplineApi } from "@/api/discipline.api";
import { ChildSelector } from "@/components/ChildSelector";
import { EmptyState } from "@/components/EmptyState";
import { StatCard } from "@/components/StatCard";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

type SectionType = "incidents" | "sanctions";

interface Incident {
  id: number;
  date: string;
  type: string;
  gravite: string;
  description: string;
  reportedBy: string;
  createdAt: string;
}

interface Sanction {
  id: number;
  type: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  motif: string;
  createdAt: string;
}

interface Dossier {
  incidents: Incident[];
  sanctions: Sanction[];
  totalIncidents: number;
  totalSanctions: number;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getGraviteColor(gravite: string): string {
  const g = gravite?.toUpperCase();
  if (g === "MINEURE") return "#eab308";
  if (g === "MOYENNE") return "#f97316";
  if (g === "MAJEURE") return "#ef4444";
  if (g === "CRITIQUE") return "#991b1b";
  return colors.textMuted;
}

function getGraviteLabel(gravite: string): string {
  const g = gravite?.toUpperCase();
  if (g === "MINEURE") return "Mineure";
  if (g === "MOYENNE") return "Moyenne";
  if (g === "MAJEURE") return "Majeure";
  if (g === "CRITIQUE") return "Critique";
  return gravite || "Inconnu";
}

function getSanctionStatusColor(statut: string): string {
  const s = statut?.toUpperCase();
  if (s === "ACTIVE" || s === "EN_COURS") return colors.error;
  if (s === "LEVEE" || s === "TERMINEE") return colors.success;
  return colors.textMuted;
}

function getSanctionStatusLabel(statut: string): string {
  const s = statut?.toUpperCase();
  if (s === "ACTIVE" || s === "EN_COURS") return "Active";
  if (s === "LEVEE" || s === "TERMINEE") return "Levee";
  return statut || "Inconnu";
}

export default function DisciplineScreen() {
  const { selectedChild, isLoading: childrenLoading } = useChild();
  const navigation = useNavigation();
  const [section, setSection] = useState<SectionType>("incidents");

  const {
    data: dossier,
    isLoading,
    refetch: refetchDossier,
    isRefetching: isRefetchingDossier,
  } = useQuery({
    queryKey: ["discipline-dossier", selectedChild?.id],
    queryFn: () => disciplineApi.getDossier(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  const {
    data: sanctions = [],
    isLoading: sanctionsLoading,
    refetch: refetchSanctions,
    isRefetching: isRefetchingSanctions,
  } = useQuery({
    queryKey: ["discipline-sanctions", selectedChild?.id],
    queryFn: () => disciplineApi.getSanctions(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  const isRefetching = isRefetchingDossier || isRefetchingSanctions;

  const onRefresh = useCallback(() => {
    refetchDossier();
    refetchSanctions();
  }, [refetchDossier, refetchSanctions]);

  // Extract incidents from dossier or use empty array
  const incidents: Incident[] = useMemo(() => {
    if (!dossier) return [];
    if (Array.isArray(dossier.incidents)) return dossier.incidents;
    if (Array.isArray(dossier)) return dossier;
    return [];
  }, [dossier]);

  // Summary stats
  const stats = useMemo(() => {
    const totalIncidents = incidents.length;
    const totalSanctions = sanctions.length;
    const severityBreakdown = {
      mineure: incidents.filter((i) => i.gravite?.toUpperCase() === "MINEURE").length,
      moyenne: incidents.filter((i) => i.gravite?.toUpperCase() === "MOYENNE").length,
      majeure: incidents.filter((i) => i.gravite?.toUpperCase() === "MAJEURE").length,
      critique: incidents.filter((i) => i.gravite?.toUpperCase() === "CRITIQUE").length,
    };
    return { totalIncidents, totalSanctions, severityBreakdown };
  }, [incidents, sanctions]);

  const sectionOptions: { key: SectionType; label: string }[] = [
    { key: "incidents", label: "Incidents" },
    { key: "sanctions", label: "Sanctions" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "center",
            marginRight: spacing.md,
          }}
        >
          <Text style={{ fontSize: fontSize.md, color: colors.text }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text }}>
            Discipline
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
            Dossier disciplinaire
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Child Selector */}
        <ChildSelector />

        {childrenLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : !selectedChild ? (
          <EmptyState
            icon="👨‍👧‍👦"
            title="Aucun enfant selectionne"
            subtitle="Selectionnez un enfant pour voir son dossier disciplinaire."
          />
        ) : isLoading || sanctionsLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {/* Summary Stats */}
            <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <StatCard
                  icon="⚠️"
                  label="Incidents"
                  value={stats.totalIncidents}
                  color={stats.totalIncidents === 0 ? colors.success : colors.warning}
                  subtitle={`${stats.totalIncidents} incident${stats.totalIncidents !== 1 ? "s" : ""}`}
                />
                <StatCard
                  icon="🚫"
                  label="Sanctions"
                  value={stats.totalSanctions}
                  color={stats.totalSanctions === 0 ? colors.success : colors.error}
                  subtitle={`${stats.totalSanctions} sanction${stats.totalSanctions !== 1 ? "s" : ""}`}
                />
              </View>
            </View>

            {/* Severity Breakdown */}
            {stats.totalIncidents > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                  marginBottom: spacing.lg,
                }}
              >
                {[
                  { label: "Mineure", count: stats.severityBreakdown.mineure, color: "#eab308" },
                  { label: "Moyenne", count: stats.severityBreakdown.moyenne, color: "#f97316" },
                  { label: "Majeure", count: stats.severityBreakdown.majeure, color: "#ef4444" },
                  { label: "Critique", count: stats.severityBreakdown.critique, color: "#991b1b" },
                ].map((item) => (
                  <View
                    key={item.label}
                    style={{
                      flex: 1,
                      backgroundColor: item.color + "15",
                      borderRadius: borderRadius.md,
                      padding: spacing.sm,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: item.color }}>
                      {item.count}
                    </Text>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Section Toggle */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                padding: 4,
                marginBottom: spacing.lg,
              }}
            >
              {sectionOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setSection(opt.key)}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.sm,
                    backgroundColor: section === opt.key ? colors.background : "transparent",
                    alignItems: "center",
                    ...(section === opt.key
                      ? {
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                          elevation: 2,
                        }
                      : {}),
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: fontSize.sm,
                      fontWeight: section === opt.key ? "700" : "500",
                      color: section === opt.key ? colors.primary : colors.textSecondary,
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Incidents Section */}
            {section === "incidents" && (
              <>
                <Text
                  style={{
                    fontSize: fontSize.xs,
                    fontWeight: "600",
                    color: colors.textMuted,
                    marginBottom: spacing.sm,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {incidents.length} incident{incidents.length !== 1 ? "s" : ""}
                </Text>

                {incidents.length === 0 ? (
                  <EmptyState
                    icon="✅"
                    title="Aucun incident"
                    subtitle="Aucun incident enregistre pour cet enfant."
                  />
                ) : (
                  incidents
                    .sort((a, b) => {
                      const dateA = new Date(a.date || a.createdAt || 0).getTime();
                      const dateB = new Date(b.date || b.createdAt || 0).getTime();
                      return dateB - dateA;
                    })
                    .map((incident) => {
                      const graviteColor = getGraviteColor(incident.gravite);
                      return (
                        <View
                          key={incident.id}
                          style={{
                            backgroundColor: colors.surface,
                            borderRadius: borderRadius.lg,
                            padding: spacing.md,
                            marginBottom: spacing.sm,
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderLeftWidth: 3,
                            borderLeftColor: graviteColor,
                          }}
                        >
                          {/* Top row: date + type badge */}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: spacing.sm,
                            }}
                          >
                            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                              {formatDate(incident.date || incident.createdAt)}
                            </Text>
                            <View style={{ flexDirection: "row", gap: spacing.xs }}>
                              {incident.type && (
                                <View
                                  style={{
                                    backgroundColor: colors.info + "15",
                                    paddingHorizontal: spacing.sm,
                                    paddingVertical: 3,
                                    borderRadius: borderRadius.sm,
                                  }}
                                >
                                  <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.info }}>
                                    {incident.type}
                                  </Text>
                                </View>
                              )}
                              <View
                                style={{
                                  backgroundColor: graviteColor + "15",
                                  paddingHorizontal: spacing.sm,
                                  paddingVertical: 3,
                                  borderRadius: borderRadius.sm,
                                }}
                              >
                                <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: graviteColor }}>
                                  {getGraviteLabel(incident.gravite)}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {/* Description */}
                          {incident.description && (
                            <Text
                              style={{
                                fontSize: fontSize.sm,
                                color: colors.text,
                                marginBottom: spacing.sm,
                                lineHeight: 20,
                              }}
                              numberOfLines={3}
                            >
                              {incident.description}
                            </Text>
                          )}

                          {/* Reported by */}
                          {incident.reportedBy && (
                            <View
                              style={{
                                paddingTop: spacing.sm,
                                borderTopWidth: 1,
                                borderTopColor: colors.border,
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                                Signale par:{" "}
                              </Text>
                              <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary }}>
                                {incident.reportedBy}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })
                )}
              </>
            )}

            {/* Sanctions Section */}
            {section === "sanctions" && (
              <>
                <Text
                  style={{
                    fontSize: fontSize.xs,
                    fontWeight: "600",
                    color: colors.textMuted,
                    marginBottom: spacing.sm,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {sanctions.length} sanction{sanctions.length !== 1 ? "s" : ""}
                </Text>

                {sanctions.length === 0 ? (
                  <EmptyState
                    icon="✅"
                    title="Aucune sanction"
                    subtitle="Aucune sanction enregistree pour cet enfant."
                  />
                ) : (
                  sanctions
                    .sort((a: Sanction, b: Sanction) => {
                      const dateA = new Date(a.dateDebut || a.createdAt || 0).getTime();
                      const dateB = new Date(b.dateDebut || b.createdAt || 0).getTime();
                      return dateB - dateA;
                    })
                    .map((sanction: Sanction) => {
                      const statusColor = getSanctionStatusColor(sanction.statut);
                      return (
                        <View
                          key={sanction.id}
                          style={{
                            backgroundColor: colors.surface,
                            borderRadius: borderRadius.lg,
                            padding: spacing.md,
                            marginBottom: spacing.sm,
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderLeftWidth: 3,
                            borderLeftColor: statusColor,
                          }}
                        >
                          {/* Top row: type + status */}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: spacing.sm,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: fontSize.sm,
                                fontWeight: "700",
                                color: colors.text,
                                flex: 1,
                              }}
                              numberOfLines={1}
                            >
                              {sanction.type || "Sanction"}
                            </Text>
                            <View
                              style={{
                                backgroundColor: statusColor + "15",
                                paddingHorizontal: spacing.sm,
                                paddingVertical: 3,
                                borderRadius: borderRadius.sm,
                              }}
                            >
                              <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: statusColor }}>
                                {getSanctionStatusLabel(sanction.statut)}
                              </Text>
                            </View>
                          </View>

                          {/* Date range */}
                          <View
                            style={{
                              flexDirection: "row",
                              gap: spacing.lg,
                              marginBottom: spacing.sm,
                            }}
                          >
                            <View>
                              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Debut</Text>
                              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginTop: 2 }}>
                                {formatDate(sanction.dateDebut)}
                              </Text>
                            </View>
                            <View>
                              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Fin</Text>
                              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginTop: 2 }}>
                                {formatDate(sanction.dateFin)}
                              </Text>
                            </View>
                          </View>

                          {/* Motif */}
                          {sanction.motif && (
                            <View
                              style={{
                                paddingTop: spacing.sm,
                                borderTopWidth: 1,
                                borderTopColor: colors.border,
                              }}
                            >
                              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Motif</Text>
                              <Text
                                style={{
                                  fontSize: fontSize.sm,
                                  color: colors.text,
                                  marginTop: 2,
                                }}
                                numberOfLines={3}
                              >
                                {sanction.motif}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
