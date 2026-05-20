import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { useState, useCallback, useMemo } from "react";
import { useChild } from "@/context/ChildContext";
import { ChildSelector } from "@/components/ChildSelector";
import { EmptyState } from "@/components/EmptyState";
import { ErrorView } from "@/components/ErrorView";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import { notesApi } from "@/api/notes.api";

function gradeColor(note: number): string {
  if (note >= 14) return colors.success;
  if (note >= 10) return colors.warning;
  return colors.error;
}

export default function GradesTab() {
  const { colors } = useTheme();
  const { selectedChild } = useChild();
  const [trimestre, setTrimestre] = useState(1);

  const { data: notes = [], isLoading, refetch, error } = useQuery({
    queryKey: ["child-notes", selectedChild?.id, trimestre],
    queryFn: () => notesApi.getByStudent(selectedChild!.id, trimestre),
    enabled: !!selectedChild?.id,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Compute overall average (weighted by coefficient)
  const overallAverage = useMemo(() => {
    if (notes.length === 0) return null;
    let totalWeighted = 0;
    let totalCoeff = 0;
    for (const note of notes) {
      const coeff = note.coefficient || 1;
      const bareme = note.bareme || 20;
      // Normalize to /20
      const normalized = (note.note / bareme) * 20;
      totalWeighted += normalized * coeff;
      totalCoeff += coeff;
    }
    return totalCoeff > 0 ? (totalWeighted / totalCoeff) : null;
  }, [notes]);

  // Compute average per module/subject
  const moyennesParMatiere = useMemo(() => {
    if (notes.length === 0) return [];
    const moduleMap: Record<string, { total: number; coeff: number; count: number; name: string }> = {};
    for (const note of notes) {
      const key = note.moduleName || note.moduleId || "Inconnu";
      if (!moduleMap[key]) {
        moduleMap[key] = { total: 0, coeff: 0, count: 0, name: String(key) };
      }
      const coeff = note.coefficient || 1;
      const bareme = note.bareme || 20;
      const normalized = (note.note / bareme) * 20;
      moduleMap[key].total += normalized * coeff;
      moduleMap[key].coeff += coeff;
      moduleMap[key].count += 1;
    }
    return Object.values(moduleMap).map((m) => ({
      name: m.name,
      average: m.coeff > 0 ? m.total / m.coeff : 0,
      count: m.count,
    })).sort((a, b) => b.average - a.average);
  }, [notes]);

  if (error) {
    return <ErrorView message={(error as Error).message} onRetry={() => refetch()} />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text, marginBottom: spacing.sm }}>
        Notes
      </Text>

      {/* Child Selector */}
      <ChildSelector />

      {/* Trimestre Selector */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: spacing.lg }}>
        {[1, 2, 3].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTrimestre(t)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: borderRadius.lg,
              backgroundColor: trimestre === t ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: trimestre === t ? colors.primary : colors.border,
            }}
          >
            <Text style={{
              fontSize: fontSize.sm, fontWeight: "700",
              color: trimestre === t ? "#fff" : colors.textSecondary,
            }}>
              T{t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* No child selected */}
      {!selectedChild ? (
        <EmptyState icon="📊" title="Aucun enfant selectionne" subtitle="Selectionnez un enfant pour voir ses notes." />
      ) : isLoading ? (
        <ListSkeleton count={5} avatar={false} />
      ) : notes.length === 0 ? (
        <EmptyState icon="📝" title="Aucune note pour ce trimestre" subtitle={`Trimestre ${trimestre} - ${selectedChild.firstName} ${selectedChild.lastName}`} />
      ) : (
        <>
          {/* Overall Average Card */}
          {overallAverage !== null && (
            <View style={{
              backgroundColor: gradeColor(overallAverage) + "12",
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              borderWidth: 1.5,
              borderColor: gradeColor(overallAverage) + "30",
              alignItems: "center",
            }}>
              <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 1 }}>
                Moyenne generale - T{trimestre}
              </Text>
              <Text style={{ fontSize: 40, fontWeight: "900", color: gradeColor(overallAverage), marginTop: spacing.xs }}>
                {overallAverage.toFixed(2)}
              </Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
                /20 - {notes.length} note{notes.length > 1 ? "s" : ""}
              </Text>
            </View>
          )}

          {/* Grade List */}
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginBottom: spacing.sm }}>
            Detail des notes
          </Text>
          {notes.map((note: any, i: number) => {
            const noteColor = gradeColor(note.note ?? 0);
            return (
              <View
                key={note.id || i}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderLeftWidth: 4,
                  borderLeftColor: noteColor,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* Score badge */}
                  <View style={{
                    width: 52, height: 52, borderRadius: 14,
                    justifyContent: "center", alignItems: "center",
                    backgroundColor: noteColor + "12", marginRight: spacing.md,
                  }}>
                    <Text style={{ fontSize: fontSize.xl, fontWeight: "900", color: noteColor }}>
                      {note.note}
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: "600", color: noteColor + "90" }}>
                      /{note.bareme || 20}
                    </Text>
                  </View>
                  {/* Details */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                      {note.moduleName || "Module"}
                    </Text>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
                      {note.examenName || "Examen"}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4, gap: 8 }}>
                      <View style={{
                        backgroundColor: colors.primary + "10",
                        paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm,
                      }}>
                        <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.primary }}>
                          Coeff. {note.coefficient || 1}
                        </Text>
                      </View>
                      {note.enseignantNom && (
                        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                          {note.enseignantNom}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Moyennes par matiere */}
          {moyennesParMatiere.length > 0 && (
            <View style={{ marginTop: spacing.lg }}>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginBottom: spacing.sm }}>
                Moyennes par matiere
              </Text>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: borderRadius.lg,
                borderWidth: 1,
                borderColor: colors.border,
                overflow: "hidden",
              }}>
                {moyennesParMatiere.map((m, idx) => (
                  <View
                    key={m.name}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: spacing.md,
                      borderBottomWidth: idx < moyennesParMatiere.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                    }}
                  >
                    {/* Progress-like bar background */}
                    <View style={{
                      position: "absolute", left: 0, top: 0, bottom: 0,
                      width: `${Math.min((m.average / 20) * 100, 100)}%`,
                      backgroundColor: gradeColor(m.average) + "08",
                    }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                        {m.name}
                      </Text>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                        {m.count} note{m.count > 1 ? "s" : ""}
                      </Text>
                    </View>
                    <View style={{
                      backgroundColor: gradeColor(m.average) + "15",
                      paddingHorizontal: 12, paddingVertical: 4,
                      borderRadius: borderRadius.lg,
                    }}>
                      <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: gradeColor(m.average) }}>
                        {m.average.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
