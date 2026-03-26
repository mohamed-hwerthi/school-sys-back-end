import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { messagesApi } from "@/api/messages.api";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

export default function MessagesTab() {
  const { user } = useAuth();

  const { data: messages = [], isLoading, refetch } = useQuery({
    queryKey: ["inbox", user?.id],
    queryFn: () => messagesApi.getInbox(user!.id),
    enabled: !!user?.id,
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
    >
      <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text, marginBottom: spacing.lg }}>Messages</Text>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : messages.length === 0 ? (
        <View style={{ padding: spacing.xl, alignItems: "center", backgroundColor: colors.surface, borderRadius: borderRadius.lg }}>
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>💬</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Aucun message</Text>
        </View>
      ) : messages.map((msg: any) => (
        <TouchableOpacity key={msg.id} style={{
          backgroundColor: msg.read ? colors.surface : colors.primary + "08",
          borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm,
          borderWidth: 1, borderColor: msg.read ? colors.border : colors.primary + "20",
        }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: msg.read ? "500" : "700", color: colors.text, flex: 1 }} numberOfLines={1}>
              {msg.senderName || "Inconnu"}
            </Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{msg.createdAt?.split("T")[0]}</Text>
          </View>
          <Text style={{ fontSize: fontSize.sm, fontWeight: msg.read ? "400" : "600", color: colors.text }} numberOfLines={1}>{msg.subject}</Text>
          <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }} numberOfLines={2}>{msg.body}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
