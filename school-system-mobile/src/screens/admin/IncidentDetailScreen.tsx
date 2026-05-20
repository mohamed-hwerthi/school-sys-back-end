import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { incidentsApi, type Sanction } from "@/api/incidents.api";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { AdminMoreStackParamList } from "@/navigation/AdminMoreStack";

type Route = RouteProp<AdminMoreStackParamList, "IncidentDetail">;

function graviteBadge(g: string) {
  if ((g ?? "").toUpperCase().includes("GRAVE")) {
    return { label: g, color: colors.error, bg: colors.error + "15" };
  }
  return { label: g || "—", color: colors.warning, bg: colors.warning + "15" };
}

function sanctionStatutBadge(s: string) {
  const up = (s ?? "").toUpperCase();
  if (up === "EN_ATTENTE_APPROBATION") return { label: "En attente", color: colors.warning, bg: colors.warning + "15" };
  if (up === "DECIDEE" || up === "APPLIQUEE") return { label: "Approuvée", color: colors.success, bg: colors.success + "15" };
  if (up === "LEVEE") return { label: "Levée", color: colors.textMuted, bg: colors.surfaceHover };
  return { label: s || "—", color: colors.info, bg: colors.info + "15" };
}

export default function IncidentDetailScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<Route>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const incidentQ = useQuery({
    queryKey: ["admin", "incident", params.incidentId],
    queryFn: () => incidentsApi.getIncident(params.incidentId),
  });
  const sanctionsQ = useQuery({
    queryKey: ["admin", "incident", params.incidentId, "sanctions"],
    queryFn: () => incidentsApi.getSanctionsByIncident(params.incidentId),
  });

  const approveMutation = useMutation({
    mutationFn: (sanctionId: string) =>
      incidentsApi.approveSanction(sanctionId, { approuveParId: user?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "incident", params.incidentId, "sanctions"] });
    },
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec de l'approbation."),
  });

  const confirmApprove = (sanctionId: string) =>
    Alert.alert("Approuver cette sanction ?", "L'élève et ses parents en seront notifiés.", [
      { text: "Annuler", style: "cancel" },
      { text: "Approuver", onPress: () => approveMutation.mutate(sanctionId) },
    ]);

  if (incidentQ.isLoading) return <DetailSkeleton cardCount={2} />;
  if (incidentQ.isError || !incidentQ.data) return <ErrorView onRetry={() => incidentQ.refetch()} />;

  const inc = incidentQ.data;
  const b = graviteBadge(inc.gravite);
  const sanctions: Sanction[] = sanctionsQ.data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
        {/* Incident card */}
        <View style={{ backgroundColor: colors.background, borderRadius: 18, padding: spacing.md, marginBottom: spacing.md, ...shadows.soft }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.text, flex: 1 }} numberOfLines={2}>
              {inc.titre}
            </Text>
            <Badge label={b.label} color={b.color} bgColor={b.bg} />
          </View>
          {inc.description ? (
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 6 }}>{inc.description}</Text>
          ) : null}
          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.sm }}>
            {[inc.type, inc.date, inc.lieu, `${inc.elevesImpliques?.length ?? 0} élève(s)`].filter(Boolean).join("  ·  ")}
          </Text>
        </View>

        {/* Sanctions */}
        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
          SANCTIONS ({sanctions.length})
        </Text>
        {sanctionsQ.isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : sanctions.length === 0 ? (
          <EmptyState icon="🛡️" title="Aucune sanction" subtitle="Aucune sanction n'a été décidée pour cet incident." />
        ) : (
          sanctions.map((s) => {
            const sb = sanctionStatutBadge(s.statut);
            const pending = (s.statut ?? "").toUpperCase() === "EN_ATTENTE_APPROBATION";
            return (
              <View key={s.id} style={{ backgroundColor: colors.background, borderRadius: 14, padding: spacing.md, marginBottom: 10, ...shadows.soft }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 }}>
                    {s.type}{s.niveau != null ? `  ·  niveau ${s.niveau}` : ""}
                  </Text>
                  <Badge label={sb.label} color={sb.color} bgColor={sb.bg} />
                </View>
                {s.description ? (
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 4 }}>{s.description}</Text>
                ) : null}
                {(s.dateDebut || s.dateFin) && (
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 }}>
                    {[s.dateDebut, s.dateFin].filter(Boolean).join("  →  ")}
                  </Text>
                )}
                {pending && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => confirmApprove(s.id)}
                    disabled={approveMutation.isPending}
                    style={{
                      marginTop: spacing.md, backgroundColor: colors.success, borderRadius: 12,
                      paddingVertical: 10, alignItems: "center", opacity: approveMutation.isPending ? 0.7 : 1,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: fontSize.sm, fontWeight: "800" }}>
                      ✓  Approuver la sanction
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
