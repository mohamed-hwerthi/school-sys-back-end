import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback, useMemo } from "react";
import { useChild } from "@/context/ChildContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { cantineApi } from "@/api/cantine.api";
import { ChildSelector } from "@/components/ChildSelector";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface Menu {
  id: number;
  jour: string;
  entree: string;
  plat: string;
  dessert: string;
  accompagnement: string;
}

interface Abonnement {
  id: number;
  type: string;
  statut: string;
  dateDebut: string;
  dateFin: string;
}

const DAYS_FR = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const DAY_ICONS: Record<string, string> = {
  Lundi: "🟢",
  Mardi: "🔵",
  Mercredi: "🟡",
  Jeudi: "🟠",
  Vendredi: "🔴",
};

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getAbonnementStatusBadge(statut: string): { label: string; color: string; bgColor: string } {
  const s = statut?.toUpperCase();
  if (s === "ACTIF" || s === "ACTIVE") return { label: "Actif", color: colors.success, bgColor: colors.success + "15" };
  if (s === "EXPIRE" || s === "EXPIRED") return { label: "Expire", color: colors.error, bgColor: colors.error + "15" };
  if (s === "SUSPENDU" || s === "SUSPENDED") return { label: "Suspendu", color: colors.warning, bgColor: colors.warning + "15" };
  return { label: statut || "Inconnu", color: colors.textMuted, bgColor: colors.textMuted + "15" };
}

export default function CantineScreen() {
  const { colors } = useTheme();
  const { selectedChild, isLoading: childrenLoading } = useChild();
  const navigation = useNavigation();
  const [currentWeek, setCurrentWeek] = useState(() => getISOWeek(new Date()));

  const {
    data: menus = [],
    isLoading: menusLoading,
    refetch: refetchMenus,
    isRefetching: menusRefetching,
  } = useQuery({
    queryKey: ["cantineMenus", currentWeek],
    queryFn: () => cantineApi.getMenus(currentWeek),
  });

  const {
    data: abonnements = [],
    isLoading: abonnementsLoading,
    refetch: refetchAbonnements,
    isRefetching: abonnementsRefetching,
  } = useQuery({
    queryKey: ["cantineAbonnement", selectedChild?.id],
    queryFn: () => cantineApi.getAbonnement(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  const isLoading = menusLoading || abonnementsLoading;
  const isRefetching = menusRefetching || abonnementsRefetching;

  const onRefresh = useCallback(() => {
    refetchMenus();
    refetchAbonnements();
  }, [refetchMenus, refetchAbonnements]);

  // Organize menus by day
  const menusByDay = useMemo(() => {
    const map: Record<string, Menu> = {};
    menus.forEach((menu: Menu) => {
      if (menu.jour) {
        map[menu.jour] = menu;
      }
    });
    return map;
  }, [menus]);

  const activeAbonnement = abonnements.find(
    (a: Abonnement) => a.statut?.toUpperCase() === "ACTIF" || a.statut?.toUpperCase() === "ACTIVE"
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "center",
            marginRight: spacing.md,
          }}
        >
          <Text style={{ fontSize: fontSize.md, color: colors.text }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text }}>
            Cantine
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
            Menus et abonnement
          </Text>
        </View>
        <Text style={{ fontSize: 28 }}>🍽️</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl * 2,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <ChildSelector />

        {childrenLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : !selectedChild ? (
          <EmptyState
            icon="👨‍👧‍👦"
            title="Aucun enfant selectionne"
            subtitle="Selectionnez un enfant pour voir la cantine."
          />
        ) : isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {/* Subscription status card */}
            <View
              style={{
                backgroundColor: activeAbonnement ? colors.success + "10" : colors.warning + "10",
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                marginBottom: spacing.lg,
                borderWidth: 1,
                borderColor: activeAbonnement ? colors.success + "20" : colors.warning + "20",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: spacing.sm,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary }}>
                    Abonnement cantine
                  </Text>
                  <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.text, marginTop: 4 }}>
                    {activeAbonnement ? activeAbonnement.type || "Standard" : "Aucun abonnement"}
                  </Text>
                </View>
                {activeAbonnement ? (
                  <Badge
                    label={getAbonnementStatusBadge(activeAbonnement.statut).label}
                    color={getAbonnementStatusBadge(activeAbonnement.statut).color}
                    bgColor={getAbonnementStatusBadge(activeAbonnement.statut).bgColor}
                  />
                ) : (
                  <Badge label="Inactif" color={colors.warning} bgColor={colors.warning + "15"} />
                )}
              </View>
              {activeAbonnement && (
                <View
                  style={{
                    flexDirection: "row",
                    gap: spacing.lg,
                    paddingTop: spacing.sm,
                    borderTopWidth: 1,
                    borderTopColor: activeAbonnement ? colors.success + "15" : colors.warning + "15",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Debut</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginTop: 2 }}>
                      {formatDate(activeAbonnement.dateDebut)}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Fin</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginTop: 2 }}>
                      {formatDate(activeAbonnement.dateFin)}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Week navigation */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.lg,
              }}
            >
              <TouchableOpacity
                onPress={() => setCurrentWeek((w) => w - 1)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.surface,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: fontSize.lg, color: colors.text }}>←</Text>
              </TouchableOpacity>

              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>
                  Semaine {currentWeek}
                </Text>
                <TouchableOpacity onPress={() => setCurrentWeek(getISOWeek(new Date()))}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.primary, fontWeight: "600", marginTop: 2 }}>
                    Semaine actuelle
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setCurrentWeek((w) => w + 1)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.surface,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: fontSize.lg, color: colors.text }}>→</Text>
              </TouchableOpacity>
            </View>

            {/* Menu section */}
            <SectionHeader title="Menu de la semaine" />

            {menus.length === 0 ? (
              <EmptyState
                icon="🍽️"
                title="Aucun menu disponible"
                subtitle="Le menu de cette semaine n'a pas encore ete publie."
              />
            ) : (
              DAYS_FR.map((day) => {
                const menu = menusByDay[day] || menusByDay[day.toUpperCase()];
                if (!menu) {
                  return (
                    <View
                      key={day}
                      style={{
                        backgroundColor: colors.surface,
                        borderRadius: borderRadius.lg,
                        padding: spacing.md,
                        marginBottom: spacing.sm,
                        borderWidth: 1,
                        borderColor: colors.border,
                        opacity: 0.5,
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: 16, marginRight: spacing.sm }}>{DAY_ICONS[day] || "⚪"}</Text>
                        <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                          {day}
                        </Text>
                      </View>
                      <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs, marginLeft: 28 }}>
                        Menu non disponible
                      </Text>
                    </View>
                  );
                }

                return (
                  <View
                    key={day}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: borderRadius.lg,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    {/* Day header */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
                      <Text style={{ fontSize: 16, marginRight: spacing.sm }}>{DAY_ICONS[day] || "⚪"}</Text>
                      <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                        {day}
                      </Text>
                    </View>

                    {/* Meals */}
                    <View style={{ marginLeft: 28, gap: spacing.xs }}>
                      {menu.entree && (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ fontSize: 14, marginRight: spacing.sm }}>🥗</Text>
                          <View>
                            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Entree</Text>
                            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                              {menu.entree}
                            </Text>
                          </View>
                        </View>
                      )}
                      {menu.plat && (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ fontSize: 14, marginRight: spacing.sm }}>🍖</Text>
                          <View>
                            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Plat</Text>
                            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                              {menu.plat}
                            </Text>
                          </View>
                        </View>
                      )}
                      {menu.accompagnement && (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ fontSize: 14, marginRight: spacing.sm }}>🥕</Text>
                          <View>
                            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Accompagnement</Text>
                            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                              {menu.accompagnement}
                            </Text>
                          </View>
                        </View>
                      )}
                      {menu.dessert && (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ fontSize: 14, marginRight: spacing.sm }}>🍰</Text>
                          <View>
                            <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Dessert</Text>
                            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                              {menu.dessert}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
