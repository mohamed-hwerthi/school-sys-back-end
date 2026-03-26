import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { parentPortalApi } from "@/api/parent-portal.api";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const JOUR_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

export default function TimetableTab() {
  const { user } = useAuth();

  const { data: children = [] } = useQuery({
    queryKey: ["children"],
    queryFn: parentPortalApi.getChildren,
    enabled: user?.role === "PARENT",
  });

  const childId = children[0]?.id;

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ["child-timetable", childId],
    queryFn: () => parentPortalApi.getChildEmploiDuTemps(childId),
    enabled: !!childId,
  });

  // Group by day
  const byDay = JOURS.map((jour, idx) => ({
    jour,
    color: JOUR_COLORS[idx],
    entries: entries.filter((e: any) => e.jourSemaine === idx + 1)
      .sort((a: any, b: any) => (a.creneauId || 0) - (b.creneauId || 0)),
  }));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
    >
      <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text, marginBottom: spacing.lg }}>Emploi du temps</Text>

      {!childId ? (
        <View style={{ padding: spacing.xl, alignItems: "center" }}>
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>🗓️</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Aucun enfant associe</Text>
        </View>
      ) : isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : byDay.map((day) => (
        <View key={day.jour} style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: day.color, marginRight: spacing.sm }} />
            <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>{day.jour}</Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginLeft: spacing.sm }}>{day.entries.length} cours</Text>
          </View>
          {day.entries.length === 0 ? (
            <View style={{ backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md }}>
              <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, fontStyle: "italic" }}>Pas de cours</Text>
            </View>
          ) : day.entries.map((entry: any, i: number) => (
            <View key={i} style={{
              backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
              marginBottom: 6, borderLeftWidth: 3, borderLeftColor: day.color,
            }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{entry.moduleName || `Module ${entry.moduleId}`}</Text>
              <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
                {entry.enseignantNom || `Enseignant ${entry.enseignantId}`} · {entry.salle || "—"}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
