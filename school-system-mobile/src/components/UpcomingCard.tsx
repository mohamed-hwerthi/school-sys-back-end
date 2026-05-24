import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";
import type {
  UpcomingPayload,
  UpcomingDevoir,
  UpcomingExamen,
  UpcomingPaiement,
} from "@/api/parent-portal.api";

interface Props {
  data: UpcomingPayload | undefined;
  onPressDevoir?: (d: UpcomingDevoir) => void;
  onPressExamen?: (e: UpcomingExamen) => void;
  onPressPaiement?: (p: UpcomingPaiement) => void;
  maxItems?: number;
}

type Row = {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  date: string;
  badgeColor: string;
  onPress?: () => void;
};

function frDate(iso: string): string {
  // "YYYY-MM-DD" → "JJ/MM"
  const [, m, d] = iso.split("T")[0].split("-");
  return `${d}/${m}`;
}

function daysUntil(iso: string): number {
  const target = new Date(iso.split("T")[0]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function dateBadgeColor(iso: string, palette: { success: string; warning: string; error: string }): string {
  const d = daysUntil(iso);
  if (d <= 1) return palette.error;
  if (d <= 3) return palette.warning;
  return palette.success;
}

export function UpcomingCard({
  data,
  onPressDevoir,
  onPressExamen,
  onPressPaiement,
  maxItems = 5,
}: Props) {
  const { colors } = useTheme();

  const rows: Row[] = [];

  data?.devoirs.forEach((d) => {
    rows.push({
      key: `dev-${d.id}`,
      icon: "📝",
      title: d.titre,
      subtitle: d.moduleNom ?? d.type,
      date: d.dateLimite,
      badgeColor: dateBadgeColor(d.dateLimite, colors),
      onPress: onPressDevoir ? () => onPressDevoir(d) : undefined,
    });
  });

  data?.examens.forEach((e) => {
    rows.push({
      key: `exam-${e.id}`,
      icon: "📚",
      title: e.name,
      subtitle: e.moduleNom ?? `Trim. ${e.trimestre}`,
      date: e.dateLimiteSaisie,
      badgeColor: dateBadgeColor(e.dateLimiteSaisie, colors),
      onPress: onPressExamen ? () => onPressExamen(e) : undefined,
    });
  });

  data?.paiements.forEach((p) => {
    const due = Number(p.montantDu) - Number(p.montantPaye);
    rows.push({
      key: `pay-${p.id}`,
      icon: "💳",
      title: p.typeFraisNom ?? "Paiement",
      subtitle: `${p.mois ?? ""} — ${due.toFixed(2)} dû`,
      date: "",
      badgeColor: p.statut === "EN_RETARD" ? colors.error : colors.warning,
      onPress: onPressPaiement ? () => onPressPaiement(p) : undefined,
    });
  });

  // Sort: items with a date first (by ascending date), then payments without
  rows.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  const visible = rows.slice(0, maxItems);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.soft,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
        <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, flex: 1 }}>
          À venir cette semaine
        </Text>
        {rows.length > maxItems && (
          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
            +{rows.length - maxItems}
          </Text>
        )}
      </View>

      {visible.length === 0 ? (
        <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center", paddingVertical: spacing.md }}>
          Aucune échéance dans les 7 prochains jours
        </Text>
      ) : (
        visible.map((row) => (
          <TouchableOpacity
            key={row.key}
            onPress={row.onPress}
            disabled={!row.onPress}
            activeOpacity={row.onPress ? 0.7 : 1}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: colors.border + "60",
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: borderRadius.md,
                backgroundColor: row.badgeColor + "15",
                justifyContent: "center",
                alignItems: "center",
                marginRight: spacing.sm,
              }}
            >
              <Text style={{ fontSize: 16 }}>{row.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>
                {row.title}
              </Text>
              <Text numberOfLines={1} style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 }}>
                {row.subtitle}
              </Text>
            </View>
            {row.date && (
              <View
                style={{
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                  borderRadius: borderRadius.sm,
                  backgroundColor: row.badgeColor + "15",
                }}
              >
                <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: row.badgeColor }}>
                  {frDate(row.date)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}
