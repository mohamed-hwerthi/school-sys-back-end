import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useState, useCallback, useMemo } from "react";
import { useChild } from "@/context/ChildContext";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { absencesApi } from "@/api/absences.api";
import { ChildSelector } from "@/components/ChildSelector";
import { EmptyState } from "@/components/EmptyState";
import { StatCard } from "@/components/StatCard";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

type FilterType = "all" | "justified" | "unjustified";

interface Absence {
  id: number;
  date: string;
  type: string;
  duree: number;
  justifiee: boolean;
  motif: string | null;
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

function getTypeLabel(type: string): string {
  if (type?.toUpperCase() === "RETARD") return "Retard";
  return "Absence";
}

function getTypeColor(type: string): string {
  if (type?.toUpperCase() === "RETARD") return colors.warning;
  return colors.error;
}

export default function AbsencesScreen() {
  const { colors } = useTheme();
  const { selectedChild, isLoading: childrenLoading } = useChild();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>("all");
  const [justifyModalVisible, setJustifyModalVisible] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [justificationText, setJustificationText] = useState("");

  const {
    data: absences = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["absences", selectedChild?.id],
    queryFn: () => absencesApi.getByEleve(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  const justifyMutation = useMutation({
    mutationFn: ({ absenceId, motif }: { absenceId: number; motif: string }) =>
      absencesApi.getHistorique(absenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["absences", selectedChild?.id] });
      setJustifyModalVisible(false);
      setJustificationText("");
      setSelectedAbsence(null);
      Alert.alert("Succes", "Justification envoyee avec succes.");
    },
    onError: (error: Error) => {
      Alert.alert("Erreur", error.message || "Impossible d'envoyer la justification.");
    },
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Stats
  const stats = useMemo(() => {
    const total = absences.filter((a: Absence) => a.type?.toUpperCase() === "ABSENCE").length;
    const justified = absences.filter(
      (a: Absence) => a.type?.toUpperCase() === "ABSENCE" && a.justifiee
    ).length;
    const unjustified = absences.filter(
      (a: Absence) => a.type?.toUpperCase() === "ABSENCE" && !a.justifiee
    ).length;
    const lateArrivals = absences.filter(
      (a: Absence) => a.type?.toUpperCase() === "RETARD"
    ).length;
    return { total, justified, unjustified, lateArrivals };
  }, [absences]);

  // Filtered absences sorted newest first
  const filteredAbsences = useMemo(() => {
    let filtered = [...absences];
    if (filter === "justified") {
      filtered = filtered.filter((a: Absence) => a.justifiee);
    } else if (filter === "unjustified") {
      filtered = filtered.filter((a: Absence) => !a.justifiee);
    }
    filtered.sort((a: Absence, b: Absence) => {
      const dateA = new Date(a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    return filtered;
  }, [absences, filter]);

  const handleTapAbsence = (absence: Absence) => {
    if (!absence.justifiee) {
      setSelectedAbsence(absence);
      setJustificationText("");
      setJustifyModalVisible(true);
    }
  };

  const handleSubmitJustification = () => {
    if (!justificationText.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un motif de justification.");
      return;
    }
    if (selectedAbsence) {
      justifyMutation.mutate({
        absenceId: selectedAbsence.id,
        motif: justificationText.trim(),
      });
    }
  };

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "justified", label: "Justifiees" },
    { key: "unjustified", label: "Non justifiees" },
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
            Absences
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
            Suivi des absences et retards
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
            subtitle="Selectionnez un enfant pour voir ses absences."
          />
        ) : isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {/* Stats Grid 2x2 */}
            <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <StatCard
                  icon="📋"
                  label="Total absences"
                  value={stats.total}
                  color={stats.total === 0 ? colors.success : colors.error}
                  subtitle={`${stats.total} absence${stats.total !== 1 ? "s" : ""}`}
                />
                <StatCard
                  icon="✅"
                  label="Justifiees"
                  value={stats.justified}
                  color={colors.success}
                  subtitle={`${stats.justified} justifiee${stats.justified !== 1 ? "s" : ""}`}
                />
              </View>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <StatCard
                  icon="❌"
                  label="Non justifiees"
                  value={stats.unjustified}
                  color={stats.unjustified === 0 ? colors.success : colors.error}
                  subtitle={`${stats.unjustified} non justifiee${stats.unjustified !== 1 ? "s" : ""}`}
                />
                <StatCard
                  icon="⏰"
                  label="Retards"
                  value={stats.lateArrivals}
                  color={stats.lateArrivals === 0 ? colors.success : colors.warning}
                  subtitle={`${stats.lateArrivals} retard${stats.lateArrivals !== 1 ? "s" : ""}`}
                />
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
              {filteredAbsences.length} enregistrement{filteredAbsences.length !== 1 ? "s" : ""}
            </Text>

            {/* Absence List */}
            {filteredAbsences.length === 0 ? (
              <EmptyState
                icon="📋"
                title="Aucune absence"
                subtitle={
                  filter === "all"
                    ? "Aucune absence enregistree pour cet enfant."
                    : filter === "justified"
                      ? "Aucune absence justifiee."
                      : "Aucune absence non justifiee."
                }
              />
            ) : (
              filteredAbsences.map((absence: Absence) => {
                const typeColor = getTypeColor(absence.type);
                const justified = absence.justifiee;
                return (
                  <TouchableOpacity
                    key={absence.id}
                    onPress={() => handleTapAbsence(absence)}
                    activeOpacity={justified ? 1 : 0.7}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: borderRadius.lg,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderLeftWidth: 3,
                      borderLeftColor: justified ? colors.success : colors.error,
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
                      <Text
                        style={{
                          fontSize: fontSize.sm,
                          fontWeight: "700",
                          color: colors.text,
                        }}
                      >
                        {formatDate(absence.date || absence.createdAt)}
                      </Text>
                      <View
                        style={{
                          backgroundColor: typeColor + "15",
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 3,
                          borderRadius: borderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSize.xs,
                            fontWeight: "700",
                            color: typeColor,
                          }}
                        >
                          {getTypeLabel(absence.type)}
                        </Text>
                      </View>
                    </View>

                    {/* Duration + Status row */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {absence.duree != null && (
                        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
                          Duree: {absence.duree}h
                        </Text>
                      )}
                      <View
                        style={{
                          backgroundColor: justified ? colors.success + "15" : colors.error + "15",
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 3,
                          borderRadius: borderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSize.xs,
                            fontWeight: "700",
                            color: justified ? colors.success : colors.error,
                          }}
                        >
                          {justified ? "Justifiee" : "Non justifiee"}
                        </Text>
                      </View>
                    </View>

                    {/* Motif if justified */}
                    {justified && absence.motif && (
                      <View
                        style={{
                          marginTop: spacing.sm,
                          paddingTop: spacing.sm,
                          borderTopWidth: 1,
                          borderTopColor: colors.border,
                        }}
                      >
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                          Motif
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSize.sm,
                            color: colors.text,
                            marginTop: 2,
                          }}
                          numberOfLines={2}
                        >
                          {absence.motif}
                        </Text>
                      </View>
                    )}

                    {/* Tap hint for unjustified */}
                    {!justified && (
                      <Text
                        style={{
                          fontSize: fontSize.xs,
                          color: colors.primary,
                          marginTop: spacing.sm,
                          fontStyle: "italic",
                        }}
                      >
                        Appuyer pour justifier
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      {/* Justification Modal */}
      <Modal
        visible={justifyModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setJustifyModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              padding: spacing.lg,
              paddingBottom: spacing.xl * 2,
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "800",
                  color: colors.text,
                }}
              >
                Justifier l'absence
              </Text>
              <TouchableOpacity
                onPress={() => setJustifyModalVisible(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: colors.surface,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: fontSize.md, color: colors.textMuted }}>X</Text>
              </TouchableOpacity>
            </View>

            {/* Absence info */}
            {selectedAbsence && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.lg,
                }}
              >
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
                  {getTypeLabel(selectedAbsence.type)} du{" "}
                  {formatDate(selectedAbsence.date || selectedAbsence.createdAt)}
                </Text>
              </View>
            )}

            {/* Text Input */}
            <Text
              style={{
                fontSize: fontSize.sm,
                fontWeight: "600",
                color: colors.text,
                marginBottom: spacing.sm,
              }}
            >
              Motif de justification
            </Text>
            <TextInput
              value={justificationText}
              onChangeText={setJustificationText}
              placeholder="Saisissez le motif de justification..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                fontSize: fontSize.sm,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                minHeight: 100,
                textAlignVertical: "top",
                marginBottom: spacing.lg,
              }}
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmitJustification}
              disabled={justifyMutation.isPending}
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                alignItems: "center",
                opacity: justifyMutation.isPending ? 0.6 : 1,
              }}
              activeOpacity={0.8}
            >
              {justifyMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    fontSize: fontSize.md,
                    fontWeight: "700",
                    color: "#fff",
                  }}
                >
                  Envoyer la justification
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
