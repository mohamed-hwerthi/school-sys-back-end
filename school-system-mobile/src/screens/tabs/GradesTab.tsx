import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { parentPortalApi } from "@/api/parent-portal.api";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

export default function GradesTab() {
  const { user } = useAuth();
  const [trimestre, setTrimestre] = useState(1);

  // For parent: use first child (TODO: child selector)
  const { data: children = [] } = useQuery({
    queryKey: ["children"],
    queryFn: parentPortalApi.getChildren,
    enabled: user?.role === "PARENT",
  });

  const childId = children[0]?.id;

  const { data: notes = [], isLoading, refetch } = useQuery({
    queryKey: ["child-notes", childId, trimestre],
    queryFn: () => parentPortalApi.getChildNotes(childId, trimestre),
    enabled: !!childId,
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
    >
      <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text, marginBottom: spacing.sm }}>Notes</Text>

      {/* Trimestre selector */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: spacing.lg }}>
        {[1, 2, 3].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTrimestre(t)}
            style={{
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.lg,
              backgroundColor: trimestre === t ? colors.primary : colors.surface,
              borderWidth: 1, borderColor: trimestre === t ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: trimestre === t ? "#fff" : colors.textSecondary }}>
              T{t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!childId ? (
        <View style={{ padding: spacing.xl, alignItems: "center" }}>
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>📊</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Aucun enfant associe</Text>
        </View>
      ) : isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : notes.length === 0 ? (
        <View style={{ padding: spacing.xl, alignItems: "center", backgroundColor: colors.surface, borderRadius: borderRadius.lg }}>
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>📝</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Aucune note pour ce trimestre</Text>
        </View>
      ) : notes.map((note: any, i: number) => (
        <View key={note.id || i} style={{
          backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
          marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
          flexDirection: "row", alignItems: "center",
        }}>
          <View style={{
            width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: spacing.md,
            backgroundColor: (note.note >= 14 ? colors.success : note.note >= 10 ? colors.warning : colors.error) + "15",
          }}>
            <Text style={{
              fontSize: fontSize.lg, fontWeight: "800",
              color: note.note >= 14 ? colors.success : note.note >= 10 ? colors.warning : colors.error,
            }}>
              {note.note}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{note.moduleName || note.examenName || "Note"}</Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Coeff. {note.coefficient || 1} · /{note.bareme || 20}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
