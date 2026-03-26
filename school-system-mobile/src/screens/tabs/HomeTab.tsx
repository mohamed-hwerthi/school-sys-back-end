import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import { parentPortalApi } from "@/api/parent-portal.api";
import { notificationsApi } from "@/api/notifications.api";

export default function HomeTab() {
  const { user } = useAuth();

  const { data: children = [], isLoading, refetch } = useQuery({
    queryKey: ["children"],
    queryFn: parentPortalApi.getChildren,
    enabled: user?.role === "PARENT",
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications-count"],
    queryFn: notificationsApi.getUnreadCount,
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon apres-midi";
    return "Bonsoir";
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
    >
      {/* Header */}
      <View style={{ marginBottom: spacing.xl }}>
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{greeting()}</Text>
        <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 6 }} />
          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{user?.role?.replace(/_/g, " ")}</Text>
        </View>
      </View>

      {/* Notification banner */}
      {unreadCount > 0 && (
        <View style={{
          backgroundColor: colors.info + "15", borderRadius: borderRadius.lg, padding: spacing.md,
          flexDirection: "row", alignItems: "center", marginBottom: spacing.lg,
          borderWidth: 1, borderColor: colors.info + "30",
        }}>
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.info + "20", justifyContent: "center", alignItems: "center", marginRight: spacing.md }}>
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{unreadCount} notification{unreadCount > 1 ? "s" : ""}</Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>non lue{unreadCount > 1 ? "s" : ""}</Text>
          </View>
        </View>
      )}

      {/* Children cards */}
      {user?.role === "PARENT" && (
        <>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginBottom: spacing.md }}>Mes enfants</Text>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
          ) : children.length === 0 ? (
            <View style={{ backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: "center" }}>
              <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>👨‍👧‍👦</Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center" }}>Aucun enfant associe a votre compte</Text>
            </View>
          ) : children.map((child: any) => (
            <View key={child.id} style={{
              backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg,
              marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primary + "15",
                  justifyContent: "center", alignItems: "center", marginRight: spacing.md,
                }}>
                  <Text style={{ fontSize: 22, fontWeight: "700", color: colors.primary }}>
                    {(child.firstName || "?")[0]}{(child.lastName || "?")[0]}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>{child.firstName} {child.lastName}</Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{child.classe} - {child.niveau}</Text>
                </View>
              </View>
            </View>
          ))}
        </>
      )}

      {/* Quick actions for non-parents */}
      {user?.role !== "PARENT" && (
        <View style={{ backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: "center" }}>
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>📚</Text>
          <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>Bienvenue sur EcoleNet</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", marginTop: spacing.sm }}>
            Consultez les notes, l'emploi du temps et les messages depuis votre telephone.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
