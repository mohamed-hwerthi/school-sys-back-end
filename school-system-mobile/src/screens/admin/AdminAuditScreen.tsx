import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { auditApi, type AuditLog } from "@/api/audit.api";
import { Badge } from "@/components/ui/Badge";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";

function actionBadge(action: string) {
  const a = (action ?? "").toUpperCase();
  if (a === "CREATE") return { color: colors.success, bg: colors.success + "15" };
  if (a === "UPDATE") return { color: colors.info, bg: colors.info + "15" };
  if (a === "DELETE") return { color: colors.error, bg: colors.error + "15" };
  if (a === "LOGIN" || a === "LOGOUT") return { color: colors.primary, bg: colors.primary + "15" };
  return { color: colors.textMuted, bg: colors.surfaceHover };
}

export default function AdminAuditScreen() {
  const { colors } = useTheme();
  const auditQ = useQuery({ queryKey: ["admin", "audit"], queryFn: () => auditApi.getLogs({ size: 100 }) });

  if (auditQ.isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
        <ListSkeleton count={8} avatar={false} trailing={false} />
      </SafeAreaView>
    );
  }
  if (auditQ.isError) return <ErrorView onRetry={() => auditQ.refetch()} />;

  const logs = auditQ.data?.content ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
      <FlatList<AuditLog>
        data={logs}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ padding: spacing.lg }}
        showsVerticalScrollIndicator={false}
        onRefresh={() => auditQ.refetch()}
        refreshing={auditQ.isFetching}
        ListHeaderComponent={
          <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.md }}>
            {auditQ.data?.totalElements ?? logs.length} événement(s)
          </Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={<EmptyState icon="📜" title="Journal vide" />}
        renderItem={({ item }) => {
          const b = actionBadge(item.action);
          return (
            <View style={{
              backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, ...shadows.soft,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Badge label={item.action} color={b.color} bgColor={b.bg} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text, marginLeft: 8, flex: 1 }} numberOfLines={1}>
                  {item.entityType}
                </Text>
              </View>
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 6 }} numberOfLines={2}>
                {[item.username, item.ipAddress].filter(Boolean).join("  ·  ")}
              </Text>
              {item.details ? (
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 4 }} numberOfLines={2}>
                  {item.details}
                </Text>
              ) : null}
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 }}>
                {item.timestamp}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
