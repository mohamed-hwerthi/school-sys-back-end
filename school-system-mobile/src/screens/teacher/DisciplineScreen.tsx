import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { incidentsApi } from "@/api/incidents.api";
import { GradientHeader } from "@/components/GradientHeader";
import { Badge } from "@/components/ui/Badge";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";

function graviteBadge(g: string) {
  if ((g ?? "").toUpperCase().includes("GRAVE")) {
    return { label: g, color: colors.error, bg: colors.error + "15" };
  }
  return { label: g || "—", color: colors.warning, bg: colors.warning + "15" };
}

export default function DisciplineScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const canManage = user?.role === "ADMIN" || user?.role === "DIRECTEUR";
  const incidentsQ = useQuery({ queryKey: ["discipline", "incidents"], queryFn: incidentsApi.getIncidents });
  const incidents = incidentsQ.data ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <GradientHeader
        title="Discipline"
        subtitle={canManage ? "Incidents · taper pour gérer les sanctions" : "Incidents — lecture seule"}
        showBack
      />

      {incidentsQ.isLoading ? (
        <ListSkeleton count={5} avatar={false} />
      ) : incidentsQ.isError ? (
        <ErrorView message="Impossible de charger les incidents" onRetry={() => incidentsQ.refetch()} />
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: spacing.lg }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => incidentsQ.refetch()}
          refreshing={incidentsQ.isFetching}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <EmptyState icon="🛡️" title="Aucun incident" subtitle="Aucun incident de discipline enregistré." />
          }
          renderItem={({ item }) => {
            const b = graviteBadge(item.gravite);
            const meta = [
              item.type,
              item.date,
              item.lieu,
              `${item.elevesImpliques?.length ?? 0} élève(s)`,
            ].filter(Boolean).join("   ·   ");
            const Card = canManage ? TouchableOpacity : View;
            return (
              <Card
                activeOpacity={0.7}
                onPress={canManage
                  ? () => (navigation as { navigate: (n: string, p: object) => void })
                      .navigate("IncidentDetail", { incidentId: item.id })
                  : undefined}
                style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 }} numberOfLines={1}>
                    {item.titre}
                  </Text>
                  <Badge label={b.label} color={b.color} bgColor={b.bg} />
                </View>
                {item.description ? (
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 }} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 6 }}>{meta}</Text>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}
