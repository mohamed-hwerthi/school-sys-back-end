import { View } from "react-native";
import { Skeleton } from "@/components/Skeleton";
import { useTheme } from "@/context/ThemeContext";
import { spacing, shadows } from "@/constants/theme";

interface ListSkeletonProps {
  /** Number of skeleton rows. */
  count?: number;
  /** Show a leading avatar circle. */
  avatar?: boolean;
  /** Show a trailing badge placeholder. */
  trailing?: boolean;
}

/** Placeholder for list screens (students, teachers, sessions, devoirs, etc.). */
export function ListSkeleton({ count = 6, avatar = true, trailing = true }: ListSkeletonProps) {
  const { colors } = useTheme();
  return (
    <View style={{ padding: spacing.lg }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row", alignItems: "center", marginBottom: 10,
            backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft,
          }}
        >
          {avatar && <Skeleton width={44} height={44} radius={22} />}
          <View style={{ flex: 1, marginLeft: avatar ? spacing.md : 0, gap: 8 }}>
            <Skeleton width="60%" height={13} />
            <Skeleton width="40%" height={10} />
          </View>
          {trailing && <Skeleton width={56} height={22} radius={11} />}
        </View>
      ))}
    </View>
  );
}
