import { useEffect, useRef } from "react";
import { Animated, type DimensionValue, type ViewStyle } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: ViewStyle;
}

/** Pulsing placeholder block. Composable to mimic any UI shape during loading. */
export function Skeleton({ width = "100%", height = 12, radius = 8, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.surfaceHover, opacity },
        style,
      ]}
    />
  );
}
