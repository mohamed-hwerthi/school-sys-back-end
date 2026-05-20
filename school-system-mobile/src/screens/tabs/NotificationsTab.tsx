import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications.api";
import { annoncesApi } from "@/api/annonces.api";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

interface Annonce {
  id: number;
  title: string;
  content: string;
  type: string;
  author: string;
  createdAt: string;
  active: boolean;
}

function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    NOTE: "📊",
    ABSENCE: "📋",
    PAIEMENT: "💳",
    MESSAGE: "💬",
    ANNONCE: "📢",
    BULLETIN: "📄",
    EDT: "🗓️",
    RETARD: "⏰",
    URGENT: "🚨",
    SYSTEM: "⚙️",
  };
  return icons[type?.toUpperCase()] || "🔔";
}

function getAnnonceTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    URGENT: colors.error,
    INFORMATION: colors.info,
    EVENEMENT: colors.primary,
    RAPPEL: colors.warning,
  };
  return typeColors[type?.toUpperCase()] || colors.info;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "A l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function getDateGroup(dateStr: string): string {
  if (!dateStr) return "Ancien";
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const notifDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (notifDate.getTime() === today.getTime()) return "Aujourd'hui";
  if (notifDate.getTime() === yesterday.getTime()) return "Hier";
  return "Plus ancien";
}

export default function NotificationsTab() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    refetch: refetchNotifications,
    isRefetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
  });

  const {
    data: annonces = [],
    isLoading: annoncesLoading,
    refetch: refetchAnnonces,
  } = useQuery({
    queryKey: ["annonces"],
    queryFn: () => annoncesApi.getAll(true),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const onRefresh = useCallback(() => {
    refetchNotifications();
    refetchAnnonces();
  }, [refetchNotifications, refetchAnnonces]);

  const handleMarkAsRead = useCallback(
    (notif: Notification) => {
      if (!notif.read) {
        markAsReadMutation.mutate(notif.id);
      }
    },
    [markAsReadMutation]
  );

  const handleMarkAllRead = useCallback(() => {
    const unreadCount = notifications.filter((n: Notification) => !n.read).length;
    if (unreadCount === 0) {
      Alert.alert("Info", "Toutes les notifications sont deja lues.");
      return;
    }
    Alert.alert(
      "Tout marquer comme lu",
      `Marquer ${unreadCount} notification${unreadCount > 1 ? "s" : ""} comme lue${unreadCount > 1 ? "s" : ""} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Confirmer", onPress: () => markAllReadMutation.mutate() },
      ]
    );
  }, [notifications, markAllReadMutation]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    const groupOrder = ["Aujourd'hui", "Hier", "Plus ancien"];

    notifications.forEach((notif: Notification) => {
      const group = getDateGroup(notif.createdAt);
      if (!groups[group]) groups[group] = [];
      groups[group].push(notif);
    });

    return groupOrder
      .filter((key) => groups[key] && groups[key].length > 0)
      .map((key) => ({ title: key, data: groups[key] }));
  }, [notifications]);

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View>
          <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text }}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Text style={{ fontSize: fontSize.sm, color: colors.primary, marginTop: 2 }}>
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
            style={{
              backgroundColor: colors.primary + "10",
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: borderRadius.md,
            }}
          >
            <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.primary }}>
              {markAllReadMutation.isPending ? "..." : "Tout lire"}
            </Text>
          </TouchableOpacity>
        )}
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
        {isLoading ? (
          <ListSkeleton count={6} />
        ) : notifications.length === 0 && annonces.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="Aucune notification"
            subtitle="Vous n'avez aucune notification pour le moment."
          />
        ) : (
          <>
            {/* Notifications grouped by date */}
            {groupedNotifications.map((group) => (
              <View key={group.title} style={{ marginBottom: spacing.lg }}>
                {/* Group header */}
                <Text
                  style={{
                    fontSize: fontSize.xs,
                    fontWeight: "700",
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: spacing.sm,
                  }}
                >
                  {group.title}
                </Text>

                {group.data.map((notif: Notification) => (
                  <TouchableOpacity
                    key={notif.id}
                    onPress={() => handleMarkAsRead(notif)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      backgroundColor: notif.read ? colors.surface : colors.primary + "06",
                      borderRadius: borderRadius.lg,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                      borderWidth: 1,
                      borderColor: notif.read ? colors.border : colors.primary + "20",
                      borderLeftWidth: notif.read ? 1 : 3,
                      borderLeftColor: notif.read ? colors.border : colors.primary,
                    }}
                  >
                    {/* Icon */}
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: notif.read
                          ? colors.textMuted + "15"
                          : colors.primary + "12",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: spacing.md,
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{getNotificationIcon(notif.type)}</Text>
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSize.sm,
                            fontWeight: notif.read ? "500" : "700",
                            color: colors.text,
                            flex: 1,
                          }}
                          numberOfLines={1}
                        >
                          {notif.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSize.xs,
                            color: colors.textMuted,
                            marginLeft: spacing.sm,
                          }}
                        >
                          {timeAgo(notif.createdAt)}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: fontSize.xs,
                          color: colors.textSecondary,
                          lineHeight: 16,
                        }}
                        numberOfLines={2}
                      >
                        {notif.body}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Announcements Section */}
            {annonces.length > 0 && (
              <View style={{ marginTop: spacing.md }}>
                <Text
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: "700",
                    color: colors.text,
                    marginBottom: spacing.md,
                  }}
                >
                  Annonces
                </Text>

                {annoncesLoading ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  annonces.map((annonce: Annonce) => (
                    <View
                      key={annonce.id}
                      style={{
                        backgroundColor: colors.surface,
                        borderRadius: borderRadius.lg,
                        padding: spacing.md,
                        marginBottom: spacing.sm,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      {/* Type badge + date */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: spacing.sm,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: getAnnonceTypeColor(annonce.type) + "15",
                            paddingHorizontal: spacing.sm,
                            paddingVertical: 3,
                            borderRadius: borderRadius.sm,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSize.xs,
                              fontWeight: "700",
                              color: getAnnonceTypeColor(annonce.type),
                            }}
                          >
                            {annonce.type || "Information"}
                          </Text>
                        </View>
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                          {timeAgo(annonce.createdAt)}
                        </Text>
                      </View>

                      {/* Title */}
                      <Text
                        style={{
                          fontSize: fontSize.md,
                          fontWeight: "700",
                          color: colors.text,
                          marginBottom: 4,
                        }}
                      >
                        {annonce.title}
                      </Text>

                      {/* Content preview */}
                      <Text
                        style={{
                          fontSize: fontSize.sm,
                          color: colors.textSecondary,
                          lineHeight: 20,
                        }}
                        numberOfLines={3}
                      >
                        {annonce.content}
                      </Text>

                      {/* Author */}
                      {annonce.author && (
                        <Text
                          style={{
                            fontSize: fontSize.xs,
                            color: colors.textMuted,
                            marginTop: spacing.sm,
                          }}
                        >
                          Par {annonce.author}
                        </Text>
                      )}
                    </View>
                  ))
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
