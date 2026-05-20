import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { Badge } from "@/components/ui/Badge";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";

export default function AdminSessionsScreen() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const sessionsQ = useQuery({ queryKey: ["admin", "sessions"], queryFn: authApi.getSessions });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => authApi.revokeSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] }),
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec de la révocation."),
  });

  const revokeAllMutation = useMutation({
    mutationFn: () => authApi.revokeOtherSessions(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] }),
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec."),
  });

  const confirmRevoke = (id: string) =>
    Alert.alert("Révoquer la session", "Cette session sera immédiatement déconnectée.", [
      { text: "Annuler", style: "cancel" },
      { text: "Révoquer", style: "destructive", onPress: () => revokeMutation.mutate(id) },
    ]);

  const confirmRevokeAll = () =>
    Alert.alert("Révoquer les autres sessions", "Toutes les sessions sauf la courante seront déconnectées.", [
      { text: "Annuler", style: "cancel" },
      { text: "Révoquer toutes", style: "destructive", onPress: () => revokeAllMutation.mutate() },
    ]);

  if (sessionsQ.isLoading) return <ListSkeleton count={4} />;
  if (sessionsQ.isError) return <ErrorView onRetry={() => sessionsQ.refetch()} />;

  const sessions = sessionsQ.data ?? [];
  const others = sessions.filter((s) => !s.current).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg }}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => sessionsQ.refetch()}
      >
        <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.md }}>
          {sessions.length} session{sessions.length > 1 ? "s" : ""} active{sessions.length > 1 ? "s" : ""}
        </Text>

        {sessions.length === 0 ? (
          <EmptyState icon="🔐" title="Aucune session" />
        ) : (
          sessions.map((s) => (
            <View key={s.id} style={{
              flexDirection: "row", alignItems: "center", marginBottom: 10,
              backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, ...shadows.soft,
            }}>
              <View style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: s.current ? colors.success + "15" : colors.primary + "12",
                justifyContent: "center", alignItems: "center", marginRight: spacing.md,
              }}>
                <Ionicons name="phone-portrait-outline" size={20} color={s.current ? colors.success : colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }} numberOfLines={1}>
                    {s.deviceName || "Appareil inconnu"}
                  </Text>
                  {s.current && <Badge label="Actuelle" color={colors.success} bgColor={colors.success + "15"} />}
                </View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                  {[s.ipAddress, s.lastUsedAt].filter(Boolean).join("  ·  ")}
                </Text>
              </View>
              {!s.current && (
                <TouchableOpacity
                  onPress={() => confirmRevoke(s.id)}
                  disabled={revokeMutation.isPending}
                  hitSlop={8}
                  style={{ padding: 6 }}
                >
                  <Ionicons name="log-out-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        {others > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={confirmRevokeAll}
            disabled={revokeAllMutation.isPending}
            style={{
              marginTop: spacing.md, padding: spacing.md, borderRadius: 14,
              backgroundColor: colors.error + "10", borderWidth: 1, borderColor: colors.error + "20",
              flexDirection: "row", alignItems: "center", justifyContent: "center",
            }}
          >
            {revokeAllMutation.isPending
              ? <ActivityIndicator color={colors.error} />
              : (
                <>
                  <Ionicons name="log-out-outline" size={18} color={colors.error} />
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.error, marginLeft: 8 }}>
                    Révoquer les {others} autres sessions
                  </Text>
                </>
              )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
