import { View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";

interface LessonCardProps {
  startTime: string;
  endTime: string;
  title: string;
  subtitle?: string;
}

/** A single timetable lesson row — used on the teacher home and timetable screens. */
export function LessonCard({ startTime, endTime, title, subtitle }: LessonCardProps) {
  const { colors } = useTheme();
  return (
    <View style={{
      flexDirection: "row", alignItems: "center",
      backgroundColor: colors.background, borderRadius: 16,
      padding: spacing.sm + 2, marginBottom: 10, ...shadows.soft,
    }}>
      <View style={{
        backgroundColor: colors.primary + "12", borderRadius: borderRadius.md,
        paddingVertical: 8, paddingHorizontal: 10, alignItems: "center", minWidth: 60,
      }}>
        <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: colors.primary }}>{startTime}</Text>
        <Text style={{ fontSize: 10, color: colors.primary, opacity: 0.7, marginTop: 1 }}>{endTime}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 }} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
