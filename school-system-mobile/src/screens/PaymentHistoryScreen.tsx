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
import { useQuery } from "@tanstack/react-query";
import { paiementsApi } from "@/api/paiements.api";
import { ChildSelector } from "@/components/ChildSelector";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

type FilterType = "all" | "paid" | "pending";

interface Paiement {
  id: number;
  montant: number;
  montantPaye: number;
  statut: string;
  typeFrais: string;
  modePaiement: string;
  reference: string;
  datePaiement: string;
  dateEcheance: string;
  createdAt: string;
}

function getStatusColor(statut: string): string {
  const s = statut?.toUpperCase();
  if (s === "PAYE" || s === "PAID" || s === "COMPLET") return colors.success;
  if (s === "EN_ATTENTE" || s === "PENDING" || s === "PARTIEL") return colors.warning;
  if (s === "EN_RETARD" || s === "OVERDUE" || s === "IMPAYE") return colors.error;
  return colors.info;
}

function getStatusLabel(statut: string): string {
  const s = statut?.toUpperCase();
  if (s === "PAYE" || s === "PAID" || s === "COMPLET") return "Paye";
  if (s === "EN_ATTENTE" || s === "PENDING") return "En attente";
  if (s === "PARTIEL") return "Partiel";
  if (s === "EN_RETARD" || s === "OVERDUE" || s === "IMPAYE") return "Impaye";
  return statut || "Inconnu";
}

function isPaid(statut: string): boolean {
  const s = statut?.toUpperCase();
  return s === "PAYE" || s === "PAID" || s === "COMPLET";
}

function isPending(statut: string): boolean {
  return !isPaid(statut);
}

function formatCurrency(amount: number): string {
  if (amount == null) return "0 FCFA";
  return amount.toLocaleString("fr-FR") + " FCFA";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PaymentHistoryScreen() {
  const { colors } = useTheme();
  const { selectedChild, isLoading: childrenLoading } = useChild();
  const [filter, setFilter] = useState<FilterType>("all");

  const {
    data: paiements = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["paiements", selectedChild?.id],
    queryFn: () => paiementsApi.getByEleve(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Filter payments
  const filteredPaiements = useMemo(() => {
    let filtered = [...paiements];
    if (filter === "paid") {
      filtered = filtered.filter((p: Paiement) => isPaid(p.statut));
    } else if (filter === "pending") {
      filtered = filtered.filter((p: Paiement) => isPending(p.statut));
    }
    // Sort by date newest first
    filtered.sort((a: Paiement, b: Paiement) => {
      const dateA = new Date(a.datePaiement || a.createdAt || 0).getTime();
      const dateB = new Date(b.datePaiement || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    return filtered;
  }, [paiements, filter]);

  // Summary calculations
  const summary = useMemo(() => {
    const totalPaid = paiements
      .filter((p: Paiement) => isPaid(p.statut))
      .reduce((sum: number, p: Paiement) => sum + (p.montantPaye || p.montant || 0), 0);
    const totalPending = paiements
      .filter((p: Paiement) => isPending(p.statut))
      .reduce((sum: number, p: Paiement) => sum + (p.montant || 0), 0);
    const total = totalPaid + totalPending;
    const percentage = total > 0 ? Math.round((totalPaid / total) * 100) : 0;
    return { totalPaid, totalPending, total, percentage };
  }, [paiements]);

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: "all", label: "Tous" },
    { key: "paid", label: "Payes" },
    { key: "pending", label: "En attente" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text }}>
          Paiements
        </Text>
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
          Historique des paiements
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl * 2,
        }}
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
            subtitle="Selectionnez un enfant pour voir ses paiements."
          />
        ) : isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {/* Summary Card */}
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                marginBottom: spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: "600",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: spacing.sm,
                }}
              >
                Resume financier
              </Text>

              {/* Progress bar */}
              <View style={{ marginBottom: spacing.md }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: spacing.xs,
                  }}
                >
                  <Text style={{ fontSize: fontSize.xxl, fontWeight: "900", color: "#fff" }}>
                    {summary.percentage}%
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSize.xs,
                      color: "rgba(255,255,255,0.7)",
                      alignSelf: "flex-end",
                    }}
                  >
                    paye
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: 8,
                      width: `${summary.percentage}%`,
                      backgroundColor: colors.background,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>

              {/* Amounts row */}
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                  paddingTop: spacing.md,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(255,255,255,0.15)",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.xs, color: "rgba(255,255,255,0.6)" }}>
                    Total paye
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSize.md,
                      fontWeight: "800",
                      color: "#fff",
                      marginTop: 2,
                    }}
                  >
                    {formatCurrency(summary.totalPaid)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.xs, color: "rgba(255,255,255,0.6)" }}>
                    Restant
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSize.md,
                      fontWeight: "800",
                      color: "#fff",
                      marginTop: 2,
                    }}
                  >
                    {formatCurrency(summary.totalPending)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Filter Tabs */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                padding: 4,
                marginBottom: spacing.lg,
              }}
            >
              {filterOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setFilter(opt.key)}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.sm,
                    backgroundColor: filter === opt.key ? colors.background : "transparent",
                    alignItems: "center",
                    ...(filter === opt.key
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
                      fontWeight: filter === opt.key ? "700" : "500",
                      color: filter === opt.key ? colors.primary : colors.textSecondary,
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payment count */}
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
              {filteredPaiements.length} paiement{filteredPaiements.length !== 1 ? "s" : ""}
            </Text>

            {/* Payment List */}
            {filteredPaiements.length === 0 ? (
              <EmptyState
                icon="💳"
                title="Aucun paiement"
                subtitle={
                  filter === "all"
                    ? "Aucun paiement enregistre pour cet enfant."
                    : filter === "paid"
                      ? "Aucun paiement effectue."
                      : "Aucun paiement en attente."
                }
              />
            ) : (
              filteredPaiements.map((paiement: Paiement) => {
                const statusColor = getStatusColor(paiement.statut);
                return (
                  <View
                    key={paiement.id}
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
                        {paiement.typeFrais || "Frais scolaires"}
                      </Text>
                      <View
                        style={{
                          backgroundColor: statusColor + "15",
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 3,
                          borderRadius: borderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSize.xs,
                            fontWeight: "700",
                            color: statusColor,
                          }}
                        >
                          {getStatusLabel(paiement.statut)}
                        </Text>
                      </View>
                    </View>

                    {/* Amount */}
                    <Text
                      style={{
                        fontSize: fontSize.xl,
                        fontWeight: "800",
                        color: statusColor,
                        marginBottom: spacing.sm,
                      }}
                    >
                      {formatCurrency(paiement.montantPaye || paiement.montant)}
                    </Text>

                    {/* Details row */}
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: spacing.md,
                        paddingTop: spacing.sm,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <View style={{ minWidth: 80 }}>
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Date</Text>
                        <Text
                          style={{
                            fontSize: fontSize.sm,
                            fontWeight: "600",
                            color: colors.text,
                            marginTop: 1,
                          }}
                        >
                          {formatDate(paiement.datePaiement || paiement.createdAt)}
                        </Text>
                      </View>
                      {paiement.modePaiement && (
                        <View style={{ minWidth: 80 }}>
                          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                            Mode
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSize.sm,
                              fontWeight: "600",
                              color: colors.text,
                              marginTop: 1,
                            }}
                          >
                            {paiement.modePaiement}
                          </Text>
                        </View>
                      )}
                      {paiement.reference && (
                        <View style={{ minWidth: 80, flex: 1 }}>
                          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                            Reference
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSize.sm,
                              fontWeight: "600",
                              color: colors.text,
                              marginTop: 1,
                            }}
                            numberOfLines={1}
                          >
                            {paiement.reference}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
