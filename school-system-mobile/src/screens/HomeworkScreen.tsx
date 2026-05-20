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
import { devoirsApi } from "@/api/devoirs.api";
import { ChildSelector } from "@/components/ChildSelector";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

type FilterType = "upcoming" | "past";

interface Homework {
  id: number;
  titre: string;
  description: string;
  moduleName: string;
  moduleId: number;
  dateEcheance: string;
  statut: string;
  submitted: boolean;
  createdAt: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getRelativeDate(dateStr: string): string {
  if (!dateStr) return "";
  const now = new Date();
  const target = new Date(dateStr);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Demain";
  if (diffDays === -1) return "Hier";
  if (diffDays > 1) return `dans ${diffDays} jours`;
  return `il y a ${Math.abs(diffDays)} jours`;
}

function getStatusColor(homework: Homework): string {
  if (homework.submitted || homework.statut?.toUpperCase() === "SOUMIS") return colors.success;
  const now = new Date();
  const deadline = new Date(homework.dateEcheance);
  if (deadline < now) return colors.error;
  return colors.warning;
}

function getStatusLabel(homework: Homework): string {
  if (homework.submitted || homework.statut?.toUpperCase() === "SOUMIS") return "Soumis";
  const now = new Date();
  const deadline = new Date(homework.dateEcheance);
  if (deadline < now) return "En retard";
  return "A faire";
}

function isUpcoming(homework: Homework): boolean {
  const now = new Date();
  const deadline = new Date(homework.dateEcheance);
  return deadline >= now;
}

export default function HomeworkScreen() {
  const { colors } = useTheme();
  const { selectedChild, isLoading: childrenLoading } = useChild();
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<FilterType>("upcoming");

  const {
    data: devoirs = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["devoirs", selectedChild?.classeId],
    queryFn: () => devoirsApi.getByClasse(selectedChild!.classeId),
    enabled: !!selectedChild?.classeId,
  });

  const {
    data: submissions = [],
  } = useQuery({
    queryKey: ["submissions", selectedChild?.id],
    queryFn: () => devoirsApi.getSubmissions(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Merge submissions with devoirs
  const enrichedDevoirs: Homework[] = useMemo(() => {
    return devoirs.map((d: any) => {
      const submission = submissions.find((s: any) => s.devoirId === d.id);
      return {
        ...d,
        submitted: !!submission,
        statut: submission ? "SOUMIS" : d.statut,
      };
    });
  }, [devoirs, submissions]);

  // Filtered and sorted
  const filteredDevoirs = useMemo(() => {
    let filtered = [...enrichedDevoirs];
    if (filter === "upcoming") {
      filtered = filtered.filter((d) => isUpcoming(d));
    } else {
      filtered = filtered.filter((d) => !isUpcoming(d));
    }
    // Sort by deadline: upcoming = soonest first, past = newest first
    filtered.sort((a, b) => {
      const dateA = new Date(a.dateEcheance || a.createdAt || 0).getTime();
      const dateB = new Date(b.dateEcheance || b.createdAt || 0).getTime();
      return filter === "upcoming" ? dateA - dateB : dateB - dateA;
    });
    return filtered;
  }, [enrichedDevoirs, filter]);

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: "upcoming", label: "A faire" },
    { key: "past", label: "Termines" },
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
            Devoirs
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
            Devoirs et travaux a rendre
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
            subtitle="Selectionnez un enfant pour voir ses devoirs."
          />
        ) : isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {/* Filter Toggle */}
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

            {/* Count */}
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
              {filteredDevoirs.length} devoir{filteredDevoirs.length !== 1 ? "s" : ""}
            </Text>

            {/* Homework List */}
            {filteredDevoirs.length === 0 ? (
              <EmptyState
                icon="📚"
                title="Aucun devoir"
                subtitle={
                  filter === "upcoming"
                    ? "Aucun devoir a rendre pour le moment."
                    : "Aucun devoir passe."
                }
              />
            ) : (
              filteredDevoirs.map((homework) => {
                const statusColor = getStatusColor(homework);
                const statusLabel = getStatusLabel(homework);
                return (
                  <TouchableOpacity
                    key={homework.id}
                    onPress={() =>
                      navigation.navigate("HomeworkDetail", { homeworkId: homework.id })
                    }
                    activeOpacity={0.7}
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
                    {/* Top row: title + status badge */}
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
                          marginRight: spacing.sm,
                        }}
                        numberOfLines={1}
                      >
                        {homework.titre || "Devoir"}
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
                          {statusLabel}
                        </Text>
                      </View>
                    </View>

                    {/* Module name */}
                    {homework.moduleName && (
                      <View
                        style={{
                          backgroundColor: colors.primary + "10",
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 2,
                          borderRadius: borderRadius.sm,
                          alignSelf: "flex-start",
                          marginBottom: spacing.sm,
                        }}
                      >
                        <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.primary }}>
                          {homework.moduleName}
                        </Text>
                      </View>
                    )}

                    {/* Description preview */}
                    {homework.description && (
                      <Text
                        style={{
                          fontSize: fontSize.sm,
                          color: colors.textSecondary,
                          marginBottom: spacing.sm,
                          lineHeight: 20,
                        }}
                        numberOfLines={2}
                      >
                        {homework.description}
                      </Text>
                    )}

                    {/* Deadline */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingTop: spacing.sm,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <Text style={{ fontSize: 14, marginRight: spacing.xs }}>📅</Text>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                        {formatDate(homework.dateEcheance)}
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSize.xs,
                          color: statusColor,
                          fontWeight: "600",
                          marginLeft: spacing.sm,
                        }}
                      >
                        {getRelativeDate(homework.dateEcheance)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
