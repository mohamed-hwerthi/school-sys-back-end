import { useMemo, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { parentPortalApi, type CalendarEvent } from "@/api/parent-portal.api";
import { useChild } from "@/context/ChildContext";
import { GradientHeader } from "@/components/GradientHeader";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";

const MONTHS_FR = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const DAYS_FR_SHORT = ["L","M","M","J","V","S","D"];

function pad(n: number): string { return n < 10 ? `0${n}` : `${n}`; }
function isoDate(y: number, m: number, d: number): string { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function daysInMonth(y: number, m: number): number { return new Date(y, m + 1, 0).getDate(); }
function firstWeekdayMondayBased(y: number, m: number): number {
  // 0 = Monday, 6 = Sunday
  const js = new Date(y, m, 1).getDay(); // Sun=0..Sat=6
  return (js + 6) % 7;
}

/**
 * MOB-FUNC-008 — calendrier custom (sans react-native-calendars).
 * Affiche les jours du mois courant ; les dates avec événements ont un point coloré.
 */
export default function ChildCalendarScreen() {
  const { colors } = useTheme();
  const { selectedChild } = useChild();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const first = `${year}-${pad(month + 1)}-01`;
  const last = `${year}-${pad(month + 1)}-${pad(daysInMonth(year, month))}`;

  const q = useQuery({
    queryKey: ["child-calendar", selectedChild?.id, first, last],
    queryFn: () => parentPortalApi.getCalendar(selectedChild!.id, first, last),
    enabled: !!selectedChild?.id,
  });

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    (q.data?.events ?? []).forEach((e) => {
      const k = e.date.slice(0, 10);
      if (!map[k]) map[k] = [];
      map[k].push(e);
    });
    return map;
  }, [q.data]);

  const selectedEvents = selectedDay ? eventsByDate[selectedDay] ?? [] : [];

  const total = daysInMonth(year, month);
  const offset = firstWeekdayMondayBased(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    setSelectedDay(null);
    if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1);
  }
  function nextMonth() {
    setSelectedDay(null);
    if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1);
  }

  if (!selectedChild) {
    return <EmptyState icon="👶" title="Aucun enfant" subtitle="Sélectionnez d'abord un enfant." />;
  }
  if (q.isLoading) return <DashboardSkeleton chartCount={1} />;
  if (q.isError) return <ErrorView onRetry={() => q.refetch()} />;

  const todayIso = isoDate(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={<RefreshControl refreshing={q.isFetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}
      >
        <GradientHeader
          subtitle="Calendrier"
          title={`${selectedChild.firstName} ${selectedChild.lastName}`}
          extraBottomPadding={20}
        />

        <View style={{ padding: spacing.lg }}>
          {/* Header mois */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.md,
              backgroundColor: colors.background,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              ...shadows.soft,
            }}
          >
            <TouchableOpacity onPress={prevMonth} activeOpacity={0.7} style={{ padding: 8 }}>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.primary }}>‹</Text>
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: "center", fontSize: fontSize.md, fontWeight: "800", color: colors.text }}>
              {MONTHS_FR[month]} {year}
            </Text>
            <TouchableOpacity onPress={nextMonth} activeOpacity={0.7} style={{ padding: 8 }}>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.primary }}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Grid */}
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: borderRadius.lg,
              padding: spacing.sm,
              ...shadows.soft,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {DAYS_FR_SHORT.map((d, i) => (
                <View key={i} style={{ flex: 1, alignItems: "center", paddingVertical: 6 }}>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted }}>{d}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {cells.map((d, idx) => {
                if (d === null) {
                  return <View key={idx} style={{ width: `${100 / 7}%`, height: 42 }} />;
                }
                const iso = isoDate(year, month, d);
                const evs = eventsByDate[iso] ?? [];
                const isToday = iso === todayIso;
                const isSelected = iso === selectedDay;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedDay(iso === selectedDay ? null : iso)}
                    activeOpacity={0.7}
                    style={{
                      width: `${100 / 7}%`,
                      height: 42,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: isSelected ? colors.primary : (isToday ? colors.primary + "20" : "transparent"),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSize.sm,
                          fontWeight: isToday || isSelected ? "800" : "500",
                          color: isSelected ? "#fff" : (isToday ? colors.primary : colors.text),
                        }}
                      >
                        {d}
                      </Text>
                    </View>
                    {/* Dots */}
                    <View style={{ flexDirection: "row", marginTop: 1, height: 4 }}>
                      {evs.slice(0, 3).map((e, i) => (
                        <View
                          key={i}
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            marginHorizontal: 1,
                            backgroundColor: e.couleur,
                          }}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Liste événements du jour sélectionné ou du mois si rien de sélectionné */}
          <Text style={{ marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1 }}>
            {selectedDay ? `ÉVÉNEMENTS DU ${selectedDay.split("-").reverse().join("/")}` : "TOUS LES ÉVÉNEMENTS DU MOIS"}
          </Text>

          {(() => {
            const list = selectedDay ? selectedEvents : (q.data?.events ?? []);
            if (list.length === 0) {
              return (
                <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center", paddingVertical: spacing.md }}>
                  Aucun événement.
                </Text>
              );
            }
            return list.map((e) => (
              <View
                key={e.id + e.type}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  marginBottom: spacing.xs,
                  ...shadows.soft,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 36,
                    borderRadius: 3,
                    backgroundColor: e.couleur,
                    marginRight: spacing.sm,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                    {e.titre}
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 }}>
                    {e.type === "DEVOIR" ? "📝 Devoir" : e.type === "EXAMEN" ? "📚 Examen" : "📅 Événement"}
                    {e.subtitle ? ` · ${e.subtitle}` : ""}
                  </Text>
                </View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
                  {e.date.slice(8, 10)}/{e.date.slice(5, 7)}
                </Text>
              </View>
            ));
          })()}
        </View>
      </ScrollView>
    </View>
  );
}
