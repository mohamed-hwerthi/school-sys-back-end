import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inscriptionsApi, type Inscription } from "@/api/inscriptions.api";
import { GradientHeader } from "@/components/GradientHeader";
import { Badge } from "@/components/ui/Badge";
import { ChipRow } from "@/components/ChipRow";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";

const STATUT_FILTERS = [
  { value: "SOUMISE", label: "À traiter" },
  { value: "ACCEPTEE", label: "Acceptées" },
  { value: "REFUSEE", label: "Refusées" },
] as const;

function statutBadge(s: string) {
  if (s === "SOUMISE") return { label: "À traiter", color: colors.warning, bg: colors.warning + "15" };
  if (s === "ACCEPTEE") return { label: "Acceptée", color: colors.success, bg: colors.success + "15" };
  if (s === "REFUSEE") return { label: "Refusée", color: colors.error, bg: colors.error + "15" };
  return { label: s, color: colors.textMuted, bg: colors.surfaceHover };
}

export default function AdminInscriptionsScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<"SOUMISE" | "ACCEPTEE" | "REFUSEE">("SOUMISE");
  const queryClient = useQueryClient();

  const inscriptionsQ = useInfiniteQuery({
    queryKey: ["admin", "inscriptions", filter],
    queryFn: ({ pageParam }) =>
      inscriptionsApi.list({ page: pageParam as number, size: 30, statut: filter }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.page + 1),
  });

  const items = inscriptionsQ.data?.pages.flatMap((p) => p.content) ?? [];
  const total = inscriptionsQ.data?.pages[0]?.totalElements ?? 0;

  const statutMutation = useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: "ACCEPTEE" | "REFUSEE" }) =>
      inscriptionsApi.updateStatut(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inscriptions"] });
    },
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec."),
  });

  const accept = (i: Inscription) =>
    Alert.alert("Accepter cette inscription ?", `${i.prenom} ${i.nom} — ${i.niveauNom ?? ""}`, [
      { text: "Annuler", style: "cancel" },
      { text: "Accepter", onPress: () => statutMutation.mutate({ id: i.id, statut: "ACCEPTEE" }) },
    ]);
  const refuse = (i: Inscription) =>
    Alert.alert("Refuser cette inscription ?", `${i.prenom} ${i.nom}`, [
      { text: "Annuler", style: "cancel" },
      { text: "Refuser", style: "destructive", onPress: () => statutMutation.mutate({ id: i.id, statut: "REFUSEE" }) },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <GradientHeader title="Inscriptions" subtitle={`${total} ${filter === "SOUMISE" ? "à traiter" : ""}`} showBack />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm }}>
        <ChipRow
          items={[...STATUT_FILTERS]}
          value={filter}
          onChange={(v) => setFilter(v as "SOUMISE" | "ACCEPTEE" | "REFUSEE")}
        />
      </View>

      {inscriptionsQ.isLoading ? (
        <ListSkeleton count={5} />
      ) : inscriptionsQ.isError ? (
        <ErrorView onRetry={() => inscriptionsQ.refetch()} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => inscriptionsQ.refetch()}
          refreshing={inscriptionsQ.isRefetching}
          onEndReached={() => {
            if (inscriptionsQ.hasNextPage && !inscriptionsQ.isFetchingNextPage) inscriptionsQ.fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={<EmptyState icon="📝" title="Aucune inscription" />}
          ListFooterComponent={
            inscriptionsQ.isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.md }} />
            ) : null
          }
          renderItem={({ item }) => {
            const b = statutBadge(item.statut);
            const pending = item.statut === "SOUMISE";
            return (
              <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 }} numberOfLines={1}>
                    {item.prenom} {item.nom}
                  </Text>
                  <Badge label={b.label} color={b.color} bgColor={b.bg} />
                </View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 }}>
                  {[item.niveauNom, item.dateNaissance, item.numeroDossier].filter(Boolean).join("  ·  ")}
                </Text>
                {(item.nomParent || item.telephoneParent) && (
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 4 }} numberOfLines={1}>
                    👤  {[item.prenomParent, item.nomParent, item.telephoneParent].filter(Boolean).join("  ·  ")}
                  </Text>
                )}
                {pending && (
                  <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.md }}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => accept(item)}
                      disabled={statutMutation.isPending}
                      style={{
                        flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 12,
                        backgroundColor: colors.success,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: fontSize.sm, fontWeight: "800" }}>✓ Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => refuse(item)}
                      disabled={statutMutation.isPending}
                      style={{
                        flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 12,
                        backgroundColor: colors.error + "12", borderWidth: 1, borderColor: colors.error + "25",
                      }}
                    >
                      <Text style={{ color: colors.error, fontSize: fontSize.sm, fontWeight: "800" }}>✕ Refuser</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
