import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ressourcesApi } from "@/api/ressources.api";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface Resource {
  id: number;
  titre: string;
  type: string;
  moduleName: string;
  moduleId: number;
  url: string;
  description: string;
  createdAt: string;
}

function getTypeIcon(type: string): string {
  const t = type?.toUpperCase();
  if (t === "PDF") return "📄";
  if (t === "VIDEO") return "🎬";
  if (t === "LINK" || t === "LIEN") return "🔗";
  if (t === "IMAGE") return "🖼️";
  if (t === "AUDIO") return "🎵";
  return "📁";
}

function getTypeColor(type: string): string {
  const t = type?.toUpperCase();
  if (t === "PDF") return colors.error;
  if (t === "VIDEO") return colors.primary;
  if (t === "LINK" || t === "LIEN") return colors.info;
  if (t === "IMAGE") return colors.success;
  if (t === "AUDIO") return colors.warning;
  return colors.textMuted;
}

function getTypeLabel(type: string): string {
  const t = type?.toUpperCase();
  if (t === "PDF") return "PDF";
  if (t === "VIDEO") return "Video";
  if (t === "LINK" || t === "LIEN") return "Lien";
  if (t === "IMAGE") return "Image";
  if (t === "AUDIO") return "Audio";
  return type || "Fichier";
}

export default function ResourcesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const {
    data: resources = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["ressources"],
    queryFn: ressourcesApi.getAll,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDownload = async (resource: Resource) => {
    if (resource.url) {
      try {
        const supported = await Linking.canOpenURL(resource.url);
        if (supported) {
          await Linking.openURL(resource.url);
        } else {
          Alert.alert("Erreur", "Impossible d'ouvrir ce lien.");
        }
      } catch {
        Alert.alert("Erreur", "Impossible d'ouvrir ce lien.");
      }
    } else {
      Alert.alert("Information", "Aucun lien disponible pour cette ressource.");
    }
  };

  // Group resources by module
  const groupedResources = resources.reduce(
    (acc: Record<string, Resource[]>, resource: Resource) => {
      const moduleName = resource.moduleName || "Autres";
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      acc[moduleName].push(resource);
      return acc;
    },
    {} as Record<string, Resource[]>
  );

  const moduleNames = Object.keys(groupedResources).sort();

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
            Ressources
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
            Supports de cours et documents
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : resources.length === 0 ? (
          <EmptyState
            icon="📚"
            title="Aucune ressource"
            subtitle="Aucune ressource disponible pour le moment."
          />
        ) : (
          moduleNames.map((moduleName) => (
            <View key={moduleName} style={{ marginBottom: spacing.lg }}>
              {/* Module Section Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: spacing.sm,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.primary + "15",
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.md,
                  }}
                >
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.primary }}>
                    {moduleName}
                  </Text>
                </View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginLeft: spacing.sm }}>
                  {groupedResources[moduleName].length} ressource
                  {groupedResources[moduleName].length !== 1 ? "s" : ""}
                </Text>
              </View>

              {/* Resources List */}
              {groupedResources[moduleName].map((resource: Resource) => {
                const typeColor = getTypeColor(resource.type);
                return (
                  <View
                    key={resource.id}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: borderRadius.lg,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                      borderWidth: 1,
                      borderColor: colors.border,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* Type Icon */}
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: typeColor + "15",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: spacing.md,
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>{getTypeIcon(resource.type)}</Text>
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: fontSize.sm,
                          fontWeight: "700",
                          color: colors.text,
                        }}
                        numberOfLines={1}
                      >
                        {resource.titre || "Ressource"}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                        <View
                          style={{
                            backgroundColor: typeColor + "15",
                            paddingHorizontal: 6,
                            paddingVertical: 1,
                            borderRadius: 4,
                            marginRight: spacing.xs,
                          }}
                        >
                          <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: typeColor }}>
                            {getTypeLabel(resource.type)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Download Button */}
                    <TouchableOpacity
                      onPress={() => handleDownload(resource)}
                      activeOpacity={0.7}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: colors.primary + "10",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 16, color: colors.primary }}>⬇</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
