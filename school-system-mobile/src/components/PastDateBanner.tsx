import { View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius } from "@/constants/theme";

interface Props {
  /** Date sélectionnée au format ISO (YYYY-MM-DD). */
  date: string;
  /** Limite max de jours en arrière (défaut : 30). */
  maxDaysBack?: number;
}

function isoToday(): string {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.round((db - da) / 86400000);
}

/**
 * MOB-FUNC-022 — bannière affichée quand l'utilisateur saisit pour une date passée.
 * À insérer en haut des formulaires de présence/note pour signaler clairement
 * qu'on est en mode rattrapage.
 *
 * Usage :
 *   <PastDateBanner date={selectedDate} />
 *
 * Côté back : les endpoints concernés doivent valider que la date est entre
 * J-{maxDaysBack} et aujourd'hui, et tracer l'audit (LATE_GRADE_ENTRY /
 * LATE_ATTENDANCE_ENTRY) lorsque la date ≠ aujourd'hui.
 */
export function PastDateBanner({ date, maxDaysBack = 30 }: Props) {
  const { colors } = useTheme();
  if (!date) return null;

  const today = isoToday();
  const diff = daysBetween(date, today);
  if (diff <= 0) return null; // date aujourd'hui ou future → pas de warning

  const tooOld = diff > maxDaysBack;
  const c = tooOld ? colors.error : colors.warning;
  const dateLabel = (() => {
    const [, m, d] = date.split("-");
    return `${d}/${m}`;
  })();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: c + "15",
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: c,
      }}
    >
      <Text style={{ fontSize: 18, marginRight: spacing.sm }}>{tooOld ? "🚫" : "⏰"}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: c }}>
          {tooOld
            ? `Date trop ancienne (J-${diff})`
            : `Saisie rattrapage — ${dateLabel} (J-${diff})`}
        </Text>
        <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
          {tooOld
            ? `Les saisies au-delà de J-${maxDaysBack} ne sont pas autorisées.`
            : "Cette saisie sera tracée dans le journal d'audit."}
        </Text>
      </View>
    </View>
  );
}
