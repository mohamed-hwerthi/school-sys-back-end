import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChild } from "@/context/ChildContext";
import { useNavigation } from "@react-navigation/native";
import { ChildSelector } from "@/components/ChildSelector";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications.api";
import { notesApi } from "@/api/notes.api";
import { parentPortalApi } from "@/api/parent-portal.api";

export default function HomeTab() {
  const { user } = useAuth();
  const { selectedChild, isLoading: childrenLoading, refetch: refetchChildren } = useChild();
  const navigation = useNavigation<any>();

  // Notifications count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications-count"],
    queryFn: notificationsApi.getUnreadCount,
  });

  // Notes for selected child (to compute average)
  const { data: notes = [], isLoading: notesLoading, refetch: refetchNotes } = useQuery({
    queryKey: ["child-notes-home", selectedChild?.id],
    queryFn: () => notesApi.getByStudent(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  // Absences for selected child
  const { data: absences = [], isLoading: absencesLoading, refetch: refetchAbsences } = useQuery({
    queryKey: ["child-absences-home", selectedChild?.id],
    queryFn: () => parentPortalApi.getChildAbsences(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  const isRefreshing = childrenLoading || notesLoading || absencesLoading;

  const onRefresh = useCallback(() => {
    refetchChildren();
    refetchNotes();
    refetchAbsences();
  }, [refetchChildren, refetchNotes, refetchAbsences]);

  // Compute grades average
  const gradesAverage = notes.length > 0
    ? (notes.reduce((sum: number, n: any) => sum + (n.note || 0), 0) / notes.length).toFixed(1)
    : "--";

  // Absences count
  const absencesCount = absences.filter((a: any) => a.type === "ABSENCE").length;

  // Greeting
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon apres-midi";
    return "Bonsoir";
  };

  // Quick action buttons
  const quickActions = [
    { icon: "📊", label: "Voir les notes", onPress: () => navigation.navigate("Tabs", { screen: "Notes" }) },
    { icon: "🗓️", label: "Emploi du temps", onPress: () => navigation.navigate("Tabs", { screen: "EDT" }) },
    { icon: "💳", label: "Paiements", onPress: () => navigation.navigate("PaymentHistory") },
    { icon: "🔔", label: "Notifications", onPress: () => navigation.navigate("Notifications") },
    { icon: "📋", label: "Absences", onPress: () => navigation.navigate("Absences") },
    { icon: "📚", label: "Devoirs", onPress: () => navigation.navigate("Homework") },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {/* Greeting Header */}
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{greeting()}</Text>
        <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 6 }} />
          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{user?.role?.replace(/_/g, " ")}</Text>
        </View>
      </View>

      {/* Notification Banner */}
      {unreadCount > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}
          activeOpacity={0.7}
          style={{
            backgroundColor: colors.info + "15",
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.info + "30",
          }}
        >
          <View style={{
            width: 36, height: 36, borderRadius: 12,
            backgroundColor: colors.info + "20",
            justifyContent: "center", alignItems: "center", marginRight: spacing.md,
          }}>
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
              {unreadCount} notification{unreadCount > 1 ? "s" : ""}
            </Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
              non lue{unreadCount > 1 ? "s" : ""}
            </Text>
          </View>
          <Text style={{ fontSize: fontSize.md, color: colors.textMuted }}>›</Text>
        </TouchableOpacity>
      )}

      {/* Child Selector */}
      <ChildSelector />

      {/* Loading state */}
      {childrenLoading && (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      )}

      {/* No child selected */}
      {!childrenLoading && !selectedChild && user?.role === "PARENT" && (
        <EmptyState
          icon="👨‍👧‍👦"
          title="Aucun enfant associe"
          subtitle="Aucun enfant n'est associe a votre compte."
        />
      )}

      {/* Selected child content */}
      {selectedChild && (
        <>
          {/* Child Profile Card */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{
                width: 56, height: 56, borderRadius: 18,
                backgroundColor: colors.primary + "15",
                justifyContent: "center", alignItems: "center", marginRight: spacing.md,
              }}>
                <Text style={{ fontSize: 22, fontWeight: "700", color: colors.primary }}>
                  {(selectedChild.firstName || "?")[0]}{(selectedChild.lastName || "?")[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.text }}>
                  {selectedChild.firstName} {selectedChild.lastName}
                </Text>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
                  {selectedChild.classe} - {selectedChild.niveau}
                </Text>
              </View>
            </View>
            {/* Details row */}
            <View style={{
              flexDirection: "row",
              marginTop: spacing.md,
              paddingTop: spacing.md,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              gap: spacing.lg,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Matricule</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text, marginTop: 2 }}>
                  {selectedChild.matricule || "--"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Classe</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text, marginTop: 2 }}>
                  {selectedChild.classe}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Statut</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                  <View style={{
                    width: 6, height: 6, borderRadius: 3, marginRight: 4,
                    backgroundColor: selectedChild.status === "Actif" ? colors.success : colors.warning,
                  }} />
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                    {selectedChild.status || "Actif"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats Grid (2x2) */}
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginBottom: spacing.md }}>
            Statistiques
          </Text>
          {(notesLoading || absencesLoading) ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : (
            <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <StatCard
                  icon="📊"
                  label="Moyenne generale"
                  value={gradesAverage}
                  color={
                    notes.length === 0
                      ? colors.info
                      : parseFloat(String(gradesAverage)) >= 14
                        ? colors.success
                        : parseFloat(String(gradesAverage)) >= 10
                          ? colors.warning
                          : colors.error
                  }
                  subtitle={notes.length > 0 ? `${notes.length} note${notes.length > 1 ? "s" : ""}` : "Aucune note"}
                />
                <StatCard
                  icon="📋"
                  label="Absences"
                  value={absencesCount}
                  color={absencesCount === 0 ? colors.success : absencesCount <= 3 ? colors.warning : colors.error}
                  subtitle={absencesCount === 0 ? "Aucune absence" : `${absencesCount} absence${absencesCount > 1 ? "s" : ""}`}
                />
              </View>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <StatCard
                  icon="💳"
                  label="Paiements"
                  value="--"
                  color={colors.info}
                  subtitle="Consulter la finance"
                />
                <StatCard
                  icon="📅"
                  label="Retards"
                  value={absences.filter((a: any) => a.type === "RETARD").length}
                  color={colors.warning}
                  subtitle="Ce trimestre"
                />
              </View>
            </View>
          )}

          {/* Actions rapides */}
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginBottom: spacing.md }}>
            Actions rapides
          </Text>
          <View style={{
            flexDirection: "row", flexWrap: "wrap",
            gap: spacing.sm, marginBottom: spacing.lg,
          }}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={action.onPress}
                style={{
                  width: "48%",
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <View style={{
                  width: 40, height: 40, borderRadius: 12,
                  backgroundColor: colors.primary + "10",
                  justifyContent: "center", alignItems: "center", marginRight: spacing.sm,
                }}>
                  <Text style={{ fontSize: 18 }}>{action.icon}</Text>
                </View>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, flexShrink: 1 }}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Non-parent welcome */}
      {user?.role !== "PARENT" && !childrenLoading && (
        <View style={{
          backgroundColor: colors.surface, borderRadius: borderRadius.lg,
          padding: spacing.xl, alignItems: "center",
        }}>
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>📚</Text>
          <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>Bienvenue sur EcoleNet</Text>
          <Text style={{
            fontSize: fontSize.sm, color: colors.textSecondary,
            textAlign: "center", marginTop: spacing.sm,
          }}>
            Consultez les notes, l'emploi du temps et les messages depuis votre telephone.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
