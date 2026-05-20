import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useCallback } from "react";
import { useChild } from "@/context/ChildContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { transportApi } from "@/api/transport.api";
import { ChildSelector } from "@/components/ChildSelector";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface Affectation {
  id: number;
  circuitId: number;
  circuitNom: string;
  numeroBus: string;
  arretNom: string;
  heurePassage: string;
  statut: string;
}

interface Arret {
  id: number;
  nom: string;
  heureArrivee: string;
  distance: string;
  ordre: number;
}

export default function TransportScreen() {
  const { colors } = useTheme();
  const { selectedChild, isLoading: childrenLoading } = useChild();
  const navigation = useNavigation();

  const {
    data: affectations = [],
    isLoading: affLoading,
    refetch: refetchAff,
    isRefetching: affRefetching,
  } = useQuery({
    queryKey: ["transportAffectation", selectedChild?.id],
    queryFn: () => transportApi.getAffectation(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  const affectation: Affectation | undefined = affectations[0];

  const {
    data: arrets = [],
    isLoading: arretsLoading,
    refetch: refetchArrets,
    isRefetching: arretsRefetching,
  } = useQuery({
    queryKey: ["transportArrets", affectation?.circuitId],
    queryFn: () => transportApi.getArrets(affectation!.circuitId),
    enabled: !!affectation?.circuitId,
  });

  const isLoading = affLoading || arretsLoading;
  const isRefetching = affRefetching || arretsRefetching;

  const onRefresh = useCallback(() => {
    refetchAff();
    refetchArrets();
  }, [refetchAff, refetchArrets]);

  // Sort stops by order
  const sortedArrets = [...arrets].sort((a: Arret, b: Arret) => (a.ordre || 0) - (b.ordre || 0));

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
            Transport
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
            Circuit et arrets
          </Text>
        </View>
        <Text style={{ fontSize: 28 }}>🚌</Text>
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
            subtitle="Selectionnez un enfant pour voir le transport."
          />
        ) : isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : !affectation ? (
          <EmptyState
            icon="🚌"
            title="Aucun transport affecte"
            subtitle="Cet enfant n'est pas inscrit au service de transport scolaire."
          />
        ) : (
          <>
            {/* My assignment card */}
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                marginBottom: spacing.lg,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Mon affectation
                </Text>
                <Badge
                  label={affectation.statut === "ACTIF" ? "Actif" : affectation.statut || "Actif"}
                  color="#fff"
                  bgColor="rgba(255,255,255,0.2)"
                />
              </View>

              <Text
                style={{
                  fontSize: fontSize.xxl,
                  fontWeight: "800",
                  color: "#fff",
                  marginBottom: spacing.md,
                }}
              >
                {affectation.circuitNom || "Circuit"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.lg,
                  paddingTop: spacing.md,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(255,255,255,0.15)",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.xs, color: "rgba(255,255,255,0.6)" }}>Bus</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    <Text style={{ fontSize: 14, marginRight: 4 }}>🚌</Text>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: "#fff" }}>
                      {affectation.numeroBus || "--"}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.xs, color: "rgba(255,255,255,0.6)" }}>Arret</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    <Text style={{ fontSize: 14, marginRight: 4 }}>📍</Text>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: "#fff" }} numberOfLines={1}>
                      {affectation.arretNom || "--"}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: fontSize.xs, color: "rgba(255,255,255,0.6)" }}>Heure</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    <Text style={{ fontSize: 14, marginRight: 4 }}>⏰</Text>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: "#fff" }}>
                      {affectation.heurePassage || "--"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Circuit stops timeline */}
            {sortedArrets.length > 0 && (
              <View style={{ marginBottom: spacing.lg }}>
                <SectionHeader title="Arrets du circuit" />

                {sortedArrets.map((arret: Arret, index: number) => {
                  const isMyStop =
                    arret.nom === affectation.arretNom ||
                    arret.id === (affectation as any).arretId;
                  const isFirst = index === 0;
                  const isLast = index === sortedArrets.length - 1;

                  return (
                    <View
                      key={arret.id || index}
                      style={{
                        flexDirection: "row",
                        minHeight: 64,
                      }}
                    >
                      {/* Timeline dots and line */}
                      <View style={{ width: 32, alignItems: "center" }}>
                        {/* Top line */}
                        {!isFirst && (
                          <View
                            style={{
                              width: 2,
                              height: 12,
                              backgroundColor: colors.primary + "30",
                            }}
                          />
                        )}
                        {isFirst && <View style={{ height: 12 }} />}

                        {/* Dot */}
                        <View
                          style={{
                            width: isMyStop ? 20 : 12,
                            height: isMyStop ? 20 : 12,
                            borderRadius: isMyStop ? 10 : 6,
                            backgroundColor: isMyStop ? colors.primary : colors.primary + "40",
                            borderWidth: isMyStop ? 3 : 0,
                            borderColor: isMyStop ? colors.primary + "30" : "transparent",
                          }}
                        />

                        {/* Bottom line */}
                        {!isLast && (
                          <View
                            style={{
                              width: 2,
                              flex: 1,
                              backgroundColor: colors.primary + "30",
                            }}
                          />
                        )}
                      </View>

                      {/* Stop info */}
                      <View
                        style={{
                          flex: 1,
                          marginLeft: spacing.sm,
                          paddingBottom: spacing.md,
                          backgroundColor: isMyStop ? colors.primary + "08" : "transparent",
                          borderRadius: isMyStop ? borderRadius.md : 0,
                          padding: isMyStop ? spacing.sm : 0,
                          marginTop: isMyStop ? -4 : 0,
                          borderWidth: isMyStop ? 1 : 0,
                          borderColor: isMyStop ? colors.primary + "20" : "transparent",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: isMyStop ? fontSize.md : fontSize.sm,
                                fontWeight: isMyStop ? "800" : "600",
                                color: isMyStop ? colors.primary : colors.text,
                              }}
                            >
                              {arret.nom}
                              {isMyStop && " (Mon arret)"}
                            </Text>
                            {arret.distance && (
                              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                                {arret.distance}
                              </Text>
                            )}
                          </View>
                          {arret.heureArrivee && (
                            <View
                              style={{
                                backgroundColor: isMyStop ? colors.primary + "15" : colors.surface,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                borderRadius: borderRadius.sm,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: fontSize.sm,
                                  fontWeight: "700",
                                  color: isMyStop ? colors.primary : colors.textSecondary,
                                }}
                              >
                                {arret.heureArrivee}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
