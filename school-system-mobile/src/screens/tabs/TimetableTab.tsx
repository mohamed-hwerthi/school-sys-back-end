import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useCallback, useMemo } from "react";
import { useChild } from "@/context/ChildContext";
import { ChildSelector } from "@/components/ChildSelector";
import { EmptyState } from "@/components/EmptyState";
import { ErrorView } from "@/components/ErrorView";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import { emploiDuTempsApi } from "@/api/emploi-du-temps.api";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const JOUR_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

// JS getDay(): 0=Sun, 1=Mon ... 6=Sat → map to our 1=Lundi ... 6=Samedi
function getTodayIndex(): number {
  const day = new Date().getDay();
  // Sunday (0) → no match (return -1), Mon(1)→1, Tue(2)→2 ... Sat(6)→6
  return day === 0 ? -1 : day;
}

function isCurrentSlot(heureDebut: string, heureFin: string): boolean {
  if (!heureDebut || !heureFin) return false;
  const now = new Date();
  const [dh, dm] = heureDebut.split(":").map(Number);
  const [fh, fm] = heureFin.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = dh * 60 + (dm || 0);
  const endMinutes = fh * 60 + (fm || 0);
  return nowMinutes >= startMinutes && nowMinutes < endMinutes;
}

export default function TimetableTab() {
  const { colors } = useTheme();
  const { selectedChild } = useChild();
  const [viewMode, setViewMode] = useState<"today" | "week">("today");

  const classeId = selectedChild?.classeId;

  // Fetch timetable entries
  const { data: entries = [], isLoading: entriesLoading, refetch: refetchEntries, error: entriesError } = useQuery({
    queryKey: ["timetable-entries", classeId],
    queryFn: () => emploiDuTempsApi.getByClasse(classeId!),
    enabled: !!classeId,
  });

  // Fetch creneaux (time slots)
  const { data: creneaux = [], isLoading: creneauxLoading, refetch: refetchCreneaux, error: creneauxError } = useQuery({
    queryKey: ["creneaux"],
    queryFn: emploiDuTempsApi.getCreneaux,
    enabled: !!classeId,
  });

  const dataError = entriesError || creneauxError;

  // Fetch remplacements
  const { data: remplacements = [], refetch: refetchRemplacements } = useQuery({
    queryKey: ["remplacements"],
    queryFn: emploiDuTempsApi.getRemplacements,
    enabled: !!classeId,
  });

  const isLoading = entriesLoading || creneauxLoading;

  const onRefresh = useCallback(() => {
    refetchEntries();
    refetchCreneaux();
    refetchRemplacements();
  }, [refetchEntries, refetchCreneaux, refetchRemplacements]);

  // Build a creneau lookup by id
  const creneauMap = useMemo(() => {
    const map: Record<number, any> = {};
    for (const c of creneaux) {
      map[c.id] = c;
    }
    return map;
  }, [creneaux]);

  // Group entries by day
  const byDay = useMemo(() => {
    return JOURS.map((jour, idx) => ({
      jour,
      jourIndex: idx + 1,
      color: JOUR_COLORS[idx],
      entries: entries
        .filter((e: any) => e.jourSemaine === idx + 1)
        .sort((a: any, b: any) => {
          const ca = creneauMap[a.creneauId];
          const cb = creneauMap[b.creneauId];
          if (ca && cb) return (ca.heureDebut || "").localeCompare(cb.heureDebut || "");
          return (a.creneauId || 0) - (b.creneauId || 0);
        }),
    }));
  }, [entries, creneauMap]);

  // Today's entries
  const todayIndex = getTodayIndex();
  const todayData = byDay.find((d) => d.jourIndex === todayIndex) || null;

  // Check for active remplacements today
  const today = new Date().toISOString().slice(0, 10);
  const activeRemplacements = remplacements.filter((r: any) => {
    return r.dateDebut <= today && r.dateFin >= today;
  });

  if (dataError) {
    return (
      <ErrorView
        message={(dataError as Error).message}
        onRetry={() => {
          refetchEntries();
          refetchCreneaux();
        }}
      />
    );
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
        Emploi du temps
      </Text>

      {/* Child Selector */}
      <ChildSelector />

      {/* View Mode Toggle */}
      <View style={{
        flexDirection: "row", gap: 8, marginBottom: spacing.lg,
        backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: 4,
        borderWidth: 1, borderColor: colors.border,
      }}>
        <TouchableOpacity
          onPress={() => setViewMode("today")}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: borderRadius.md,
            backgroundColor: viewMode === "today" ? colors.primary : "transparent",
            alignItems: "center",
          }}
        >
          <Text style={{
            fontSize: fontSize.sm, fontWeight: "700",
            color: viewMode === "today" ? "#fff" : colors.textSecondary,
          }}>
            Aujourd'hui
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode("week")}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: borderRadius.md,
            backgroundColor: viewMode === "week" ? colors.primary : "transparent",
            alignItems: "center",
          }}
        >
          <Text style={{
            fontSize: fontSize.sm, fontWeight: "700",
            color: viewMode === "week" ? "#fff" : colors.textSecondary,
          }}>
            Semaine
          </Text>
        </TouchableOpacity>
      </View>

      {/* Remplacement Banner */}
      {activeRemplacements.length > 0 && (
        <View style={{
          backgroundColor: colors.warning + "12",
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.warning + "30",
          flexDirection: "row",
          alignItems: "center",
        }}>
          <View style={{
            width: 36, height: 36, borderRadius: 12,
            backgroundColor: colors.warning + "20",
            justifyContent: "center", alignItems: "center", marginRight: spacing.md,
          }}>
            <Text style={{ fontSize: 16 }}>🔄</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
              {activeRemplacements.length} remplacement{activeRemplacements.length > 1 ? "s" : ""} actif{activeRemplacements.length > 1 ? "s" : ""}
            </Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
              Des changements sont prevus aujourd'hui
            </Text>
          </View>
        </View>
      )}

      {/* No child selected */}
      {!selectedChild ? (
        <EmptyState icon="🗓️" title="Aucun enfant selectionne" subtitle="Selectionnez un enfant pour voir son emploi du temps." />
      ) : isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : entries.length === 0 ? (
        <EmptyState icon="🗓️" title="Aucun emploi du temps" subtitle={`Aucun cours programme pour ${selectedChild.firstName}.`} />
      ) : viewMode === "today" ? (
        /* ========== TODAY VIEW ========== */
        <View>
          {todayIndex === -1 || !todayData ? (
            <EmptyState icon="☀️" title="C'est le weekend !" subtitle="Pas de cours aujourd'hui. Profitez de votre journee !" />
          ) : todayData.entries.length === 0 ? (
            <EmptyState icon="✅" title={`Pas de cours ${todayData.jour}`} subtitle="Aucun cours programme pour aujourd'hui." />
          ) : (
            <>
              {/* Day header */}
              <View style={{
                flexDirection: "row", alignItems: "center",
                marginBottom: spacing.md,
              }}>
                <View style={{
                  width: 14, height: 14, borderRadius: 7,
                  backgroundColor: todayData.color, marginRight: spacing.sm,
                }} />
                <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.text }}>
                  {todayData.jour}
                </Text>
                <Text style={{
                  fontSize: fontSize.sm, color: colors.textMuted, marginLeft: spacing.sm,
                }}>
                  {todayData.entries.length} cours
                </Text>
              </View>

              {/* Today's entries - larger cards */}
              {todayData.entries.map((entry: any, i: number) => {
                const creneau = creneauMap[entry.creneauId];
                const heureDebut = creneau?.heureDebut || "";
                const heureFin = creneau?.heureFin || "";
                const isCurrent = isCurrentSlot(heureDebut, heureFin);

                return (
                  <View
                    key={entry.id || i}
                    style={{
                      backgroundColor: isCurrent ? colors.primary + "08" : colors.surface,
                      borderRadius: borderRadius.lg,
                      padding: spacing.lg,
                      marginBottom: spacing.sm,
                      borderWidth: isCurrent ? 2 : 1,
                      borderColor: isCurrent ? colors.primary : colors.border,
                      borderLeftWidth: 4,
                      borderLeftColor: isCurrent ? colors.primary : todayData.color,
                    }}
                  >
                    {/* Current class indicator */}
                    {isCurrent && (
                      <View style={{
                        flexDirection: "row", alignItems: "center",
                        marginBottom: spacing.sm,
                      }}>
                        <View style={{
                          width: 8, height: 8, borderRadius: 4,
                          backgroundColor: colors.primary, marginRight: 6,
                        }} />
                        <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.primary, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          En cours
                        </Text>
                      </View>
                    )}

                    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                      {/* Time column */}
                      <View style={{
                        width: 64, marginRight: spacing.md,
                        alignItems: "center",
                      }}>
                        <Text style={{
                          fontSize: fontSize.md, fontWeight: "800",
                          color: isCurrent ? colors.primary : colors.text,
                        }}>
                          {heureDebut ? heureDebut.slice(0, 5) : "--:--"}
                        </Text>
                        <View style={{
                          width: 1, height: 12, backgroundColor: colors.border, marginVertical: 3,
                        }} />
                        <Text style={{
                          fontSize: fontSize.sm, fontWeight: "600",
                          color: colors.textMuted,
                        }}>
                          {heureFin ? heureFin.slice(0, 5) : "--:--"}
                        </Text>
                      </View>

                      {/* Content */}
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: fontSize.md, fontWeight: "700", color: colors.text,
                        }}>
                          {entry.moduleName || `Module ${entry.moduleId}`}
                        </Text>
                        <Text style={{
                          fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4,
                        }}>
                          {entry.enseignantNom || `Enseignant ${entry.enseignantId || "--"}`}
                        </Text>
                        {entry.salle && (
                          <View style={{
                            flexDirection: "row", alignItems: "center", marginTop: 6,
                          }}>
                            <View style={{
                              backgroundColor: colors.info + "12",
                              paddingHorizontal: 8, paddingVertical: 3,
                              borderRadius: borderRadius.sm,
                            }}>
                              <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.info }}>
                                Salle {entry.salle}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>
      ) : (
        /* ========== WEEK VIEW ========== */
        <View>
          {byDay.map((day) => (
            <View key={day.jour} style={{ marginBottom: spacing.lg }}>
              {/* Day header */}
              <View style={{
                flexDirection: "row", alignItems: "center", marginBottom: spacing.sm,
              }}>
                <View style={{
                  width: 12, height: 12, borderRadius: 6,
                  backgroundColor: day.color, marginRight: spacing.sm,
                }} />
                <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                  {day.jour}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginLeft: spacing.sm }}>
                  {day.entries.length} cours
                </Text>
                {day.jourIndex === todayIndex && (
                  <View style={{
                    backgroundColor: colors.primary + "15",
                    paddingHorizontal: 8, paddingVertical: 2,
                    borderRadius: borderRadius.sm, marginLeft: spacing.sm,
                  }}>
                    <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.primary }}>
                      Aujourd'hui
                    </Text>
                  </View>
                )}
              </View>

              {day.entries.length === 0 ? (
                <View style={{
                  backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
                }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, fontStyle: "italic" }}>
                    Pas de cours
                  </Text>
                </View>
              ) : (
                day.entries.map((entry: any, i: number) => {
                  const creneau = creneauMap[entry.creneauId];
                  const heureDebut = creneau?.heureDebut || "";
                  const heureFin = creneau?.heureFin || "";
                  const isCurrent = day.jourIndex === todayIndex && isCurrentSlot(heureDebut, heureFin);

                  return (
                    <View
                      key={entry.id || i}
                      style={{
                        backgroundColor: isCurrent ? colors.primary + "06" : colors.surface,
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                        marginBottom: 6,
                        borderLeftWidth: 3,
                        borderLeftColor: isCurrent ? colors.primary : day.color,
                        borderWidth: isCurrent ? 1 : 0,
                        borderColor: isCurrent ? colors.primary + "40" : "transparent",
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {/* Time badge */}
                        <View style={{
                          width: 56, marginRight: spacing.sm,
                          alignItems: "center",
                        }}>
                          <Text style={{
                            fontSize: fontSize.xs, fontWeight: "700",
                            color: isCurrent ? colors.primary : colors.textSecondary,
                          }}>
                            {heureDebut ? heureDebut.slice(0, 5) : "--:--"}
                          </Text>
                          <Text style={{
                            fontSize: 9, color: colors.textMuted,
                          }}>
                            {heureFin ? heureFin.slice(0, 5) : "--:--"}
                          </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                            {entry.moduleName || `Module ${entry.moduleId}`}
                          </Text>
                          <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
                            {entry.enseignantNom || `Enseignant ${entry.enseignantId || "--"}`}
                            {entry.salle ? ` · ${entry.salle}` : ""}
                          </Text>
                        </View>

                        {isCurrent && (
                          <View style={{
                            width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary,
                          }} />
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
