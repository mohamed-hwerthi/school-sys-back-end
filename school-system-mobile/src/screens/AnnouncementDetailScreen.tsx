import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useRoute } from "@react-navigation/native";
import { annoncesApi } from "@/api/annonces.api";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

function getAnnonceTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    URGENT: colors.error,
    INFORMATION: colors.info,
    EVENEMENT: colors.primary,
    RAPPEL: colors.warning,
  };
  return typeColors[type?.toUpperCase()] || colors.info;
}

function formatFullDate(dateStr: string): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AnnouncementDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const announcementId = route.params?.announcementId as number;

  const {
    data: annonce,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["annonce", announcementId],
    queryFn: () => annoncesApi.getById(announcementId),
    enabled: !!announcementId,
  });

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
        <Text
          style={{
            fontSize: fontSize.lg,
            fontWeight: "700",
            color: colors.text,
            flex: 1,
          }}
          numberOfLines={1}
        >
          Annonce
        </Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : isError || !annonce ? (
        <View style={{ flex: 1, justifyContent: "center", padding: spacing.lg }}>
          <EmptyState
            icon="📢"
            title="Annonce introuvable"
            subtitle="Cette annonce n'existe pas ou a ete supprimee."
          />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
        >
          {/* Type badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.lg,
            }}
          >
            <View
              style={{
                backgroundColor: getAnnonceTypeColor(annonce.type) + "15",
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.md,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: "700",
                  color: getAnnonceTypeColor(annonce.type),
                }}
              >
                {annonce.type || "Information"}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: fontSize.xxl,
              fontWeight: "800",
              color: colors.text,
              marginBottom: spacing.md,
              lineHeight: 34,
            }}
          >
            {annonce.title}
          </Text>

          {/* Meta info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.lg,
              gap: spacing.md,
            }}
          >
            {annonce.author && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 9,
                    backgroundColor: colors.primary + "15",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: spacing.xs,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>
                    {annonce.author
                      .split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </Text>
                </View>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                  {annonce.author}
                </Text>
              </View>
            )}
          </View>

          {/* Date */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.lg,
              paddingBottom: spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 16, marginRight: spacing.sm }}>📅</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              {formatFullDate(annonce.createdAt)}
            </Text>
          </View>

          {/* Content */}
          <Text
            style={{
              fontSize: fontSize.md,
              color: colors.text,
              lineHeight: 26,
            }}
          >
            {annonce.content}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
