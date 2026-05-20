import { View } from "react-native";
import { Skeleton } from "@/components/Skeleton";
import { useTheme } from "@/context/ThemeContext";
import { spacing, shadows } from "@/constants/theme";

/** Placeholder for detail-shaped screens : profile card + info cards. */
export function DetailSkeleton({ cardCount = 3 }: { cardCount?: number }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        {/* Profile card */}
        <View
          style={{
            backgroundColor: colors.background, borderRadius: 18, padding: spacing.md,
            alignItems: "center", gap: 10, ...shadows.soft,
          }}
        >
          <Skeleton width={72} height={72} radius={24} />
          <Skeleton width="50%" height={16} />
          <Skeleton width="30%" height={12} />
          <Skeleton width={80} height={20} radius={12} />
        </View>

        {/* Info cards */}
        {Array.from({ length: cardCount }).map((_, i) => (
          <View key={i} style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, gap: 10, ...shadows.soft }}>
            <Skeleton width="35%" height={10} />
            <Skeleton width="85%" height={13} />
            <Skeleton width="70%" height={13} />
            <Skeleton width="60%" height={13} />
          </View>
        ))}
      </View>
    </View>
  );
}
