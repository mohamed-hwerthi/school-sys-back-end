import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Skeleton } from "@/components/Skeleton";
import { useTheme } from "@/context/ThemeContext";
import { spacing, shadows } from "@/constants/theme";

/** Placeholder for dashboard-shaped screens : gradient header + floating stats + chart cards. */
export function DashboardSkeleton({ chartCount = 2 }: { chartCount?: number }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Gradient header placeholder */}
      <View
        style={{
          paddingTop: insets.top + 22,
          paddingBottom: 60,
          paddingHorizontal: spacing.lg,
          backgroundColor: colors.primary + "35",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          gap: 8,
        }}
      >
        <Skeleton width="40%" height={12} style={{ backgroundColor: "rgba(255,255,255,0.45)" }} />
        <Skeleton width="60%" height={20} style={{ backgroundColor: "rgba(255,255,255,0.55)" }} />
      </View>

      {/* 3 floating stat cards */}
      <View style={{ flexDirection: "row", gap: 10, marginHorizontal: spacing.lg, marginTop: -46 }}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              flex: 1, backgroundColor: colors.background, borderRadius: 18,
              padding: spacing.md, gap: 8, ...shadows.soft,
            }}
          >
            <Skeleton width={32} height={32} radius={10} />
            <Skeleton width="70%" height={18} />
            <Skeleton width="50%" height={10} />
          </View>
        ))}
      </View>

      {/* Chart cards */}
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        {Array.from({ length: chartCount }).map((_, i) => (
          <View key={i} style={{ backgroundColor: colors.background, borderRadius: 18, padding: spacing.md, ...shadows.soft, gap: 12 }}>
            <Skeleton width="45%" height={14} />
            <Skeleton width="100%" height={160} radius={12} />
          </View>
        ))}
      </View>
    </View>
  );
}
