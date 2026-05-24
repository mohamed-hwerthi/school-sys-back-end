import { View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";
import type { DashboardKpis } from "@/api/admin.api";

interface Props {
  data: DashboardKpis | undefined;
}

function fmtMoney(s: string | undefined): string {
  if (!s) return "—";
  const n = Number(s);
  if (Number.isNaN(n)) return s;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)} k`;
  return n.toFixed(0);
}

function colorForPct(pct: number, palette: { success: string; warning: string; error: string }, ok = 80, warn = 60): string {
  if (pct >= ok) return palette.success;
  if (pct >= warn) return palette.warning;
  return palette.error;
}

interface KpiProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
}

function Kpi({ icon, label, value, subtitle, color }: KpiProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.soft,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: borderRadius.md,
          backgroundColor: color + "15",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color }}>{value}</Text>
      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>{label}</Text>
      {subtitle && (
        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 1 }}>{subtitle}</Text>
      )}
    </View>
  );
}

export function AdminKpiGrid({ data }: Props) {
  const { colors } = useTheme();

  if (!data) {
    return null;
  }

  return (
    <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <Kpi
          icon="🎓"
          label="Effectif"
          value={String(data.effectifTotal ?? 0)}
          subtitle="élèves actifs"
          color={colors.primary}
        />
        <Kpi
          icon="🏫"
          label="Occupation"
          value={`${data.tauxOccupation?.toFixed(0) ?? 0}%`}
          subtitle="classes remplies"
          color={colorForPct(data.tauxOccupation ?? 0, colors, 75, 50)}
        />
      </View>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <Kpi
          icon="💰"
          label="CA du mois"
          value={fmtMoney(data.caDuMois)}
          subtitle="encaissé"
          color={colors.success}
        />
        <Kpi
          icon="⚠️"
          label="Impayés"
          value={fmtMoney(data.impayes)}
          subtitle="à recouvrer"
          color={Number(data.impayes) > 0 ? colors.error : colors.success}
        />
      </View>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <Kpi
          icon="✅"
          label="Présence"
          value={`${data.tauxPresence?.toFixed(0) ?? 0}%`}
          subtitle="30 derniers jours"
          color={colorForPct(data.tauxPresence ?? 0, colors, 90, 80)}
        />
        <Kpi
          icon="📈"
          label="Réussite"
          value={`${data.tauxReussite?.toFixed(0) ?? 0}%`}
          subtitle="moyenne ≥ 10"
          color={colorForPct(data.tauxReussite ?? 0, colors, 70, 50)}
        />
      </View>
    </View>
  );
}
