import { useEffect, useRef, type ComponentProps } from "react";
import { View, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/context/ThemeContext";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Animated tab icon with an active "pill" highlight.
 * Scales up slightly and reveals a tinted rounded background when focused.
 */
function AnimatedTabIcon({ name, focused, color }: { name: IoniconName; focused: boolean; color: string }) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(focused ? 1.08 : 0.95)).current;
  const bgOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.08 : 0.95,
        useNativeDriver: true,
        speed: 18,
        bounciness: 8,
      }),
      Animated.timing(bgOpacity, {
        toValue: focused ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, scale, bgOpacity]);

  return (
    <View style={{ width: 54, height: 34, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={{
          position: "absolute",
          width: 48,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.primary + "1A",
          opacity: bgOpacity,
        }}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={name} size={22} color={color} />
      </Animated.View>
    </View>
  );
}

/** Builds a modern animated tab-bar icon with an active pill background. */
export function tabIcon(name: IoniconName) {
  return function TabBarIcon({ focused, color }: { focused: boolean; color: string }) {
    return <AnimatedTabIcon name={name} focused={focused} color={color} />;
  };
}

/** Hook returning theme-aware bottom-tab styling for the role-specific navigators. */
export function useRoleTabScreenOptions(): BottomTabNavigationOptions {
  const { colors, scheme } = useTheme();
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textMuted,
    tabBarShowLabel: true,
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: "700",
      marginTop: -2,
      letterSpacing: 0.2,
    },
    tabBarItemStyle: {
      paddingTop: 8,
      paddingBottom: 4,
    },
    tabBarStyle: {
      backgroundColor: colors.background,
      height: 68,
      paddingHorizontal: 4,
      shadowColor: "#000",
      shadowOpacity: scheme === "dark" ? 0.35 : 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: -3 },
      elevation: 12,
      borderTopWidth: scheme === "dark" ? 1 : 0,
      borderTopColor: scheme === "dark" ? colors.border : "transparent",
    },
  };
}
