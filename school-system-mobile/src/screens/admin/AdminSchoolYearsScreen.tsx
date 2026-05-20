import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolYearsApi, type SchoolYear } from "@/api/school-years.api";
import { GradientHeader } from "@/components/GradientHeader";
import { Badge } from "@/components/ui/Badge";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";

export default function AdminSchoolYearsScreen() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const yearsQ = useQuery({ queryKey: ["admin", "school-years"], queryFn: schoolYearsApi.list });

  const activateMutation = useMutation({
    mutationFn: (id: string) => schoolYearsApi.activate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "school-years"] }),
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec de l'activation."),
  });

  const cloturerMutation = useMutation({
    mutationFn: (id: string) => schoolYearsApi.cloturer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "school-years"] }),
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec de la clôture."),
  });

  const confirmActivate = (y: SchoolYear) =>
    Alert.alert("Activer cette année ?", `« ${y.label} » deviendra l'année scolaire active.`, [
      { text: "Annuler", style: "cancel" },
      { text: "Activer", onPress: () => activateMutation.mutate(y.id) },
    ]);

  const confirmCloturer = (y: SchoolYear) =>
    Alert.alert("Clôturer cette année ?", `« ${y.label} » sera marquée comme clôturée.`, [
      { text: "Annuler", style: "cancel" },
      { text: "Clôturer", style: "destructive", onPress: () => cloturerMutation.mutate(y.id) },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <GradientHeader title="Années scolaires" subtitle="Activation & clôture" showBack />

      {yearsQ.isLoading ? (
        <ListSkeleton count={4} avatar={false} trailing={false} />
      ) : yearsQ.isError ? (
        <ErrorView onRetry={() => yearsQ.refetch()} />
      ) : (
        <FlatList
          data={yearsQ.data ?? []}
          keyExtractor={(y) => y.id}
          contentContainerStyle={{ padding: spacing.lg }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => yearsQ.refetch()}
          refreshing={yearsQ.isFetching}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={<EmptyState icon="📅" title="Aucune année scolaire" />}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.text, flex: 1 }}>
                  {item.label}
                </Text>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  {item.active && <Badge label="Active" color={colors.success} bgColor={colors.success + "15"} />}
                  {item.cloturee && <Badge label="Clôturée" color={colors.textMuted} bgColor={colors.surfaceHover} />}
                </View>
              </View>
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 }}>
                {[item.dateDebut, item.dateFin].filter(Boolean).join("  →  ") || "—"}
              </Text>

              {/* 1-tap actions */}
              <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.md }}>
                {!item.active && !item.cloturee && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => confirmActivate(item)}
                    disabled={activateMutation.isPending}
                    style={{
                      flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 12,
                      backgroundColor: colors.primary,
                    }}
                  >
                    {activateMutation.isPending && activateMutation.variables === item.id
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={{ color: "#fff", fontSize: fontSize.sm, fontWeight: "800" }}>Activer</Text>}
                  </TouchableOpacity>
                )}
                {!item.cloturee && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => confirmCloturer(item)}
                    disabled={cloturerMutation.isPending}
                    style={{
                      flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 12,
                      backgroundColor: colors.error + "12", borderWidth: 1, borderColor: colors.error + "25",
                    }}
                  >
                    <Text style={{ color: colors.error, fontSize: fontSize.sm, fontWeight: "800" }}>Clôturer</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
