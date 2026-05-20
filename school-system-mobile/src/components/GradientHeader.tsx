import { type ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { spacing, fontSize, gradients } from "@/constants/theme";

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  /** Extra content rendered below the title, inside the gradient band. */
  children?: ReactNode;
  /** Extra bottom padding — use when content should overlap the header. */
  extraBottomPadding?: number;
  /** Show a back arrow that pops the navigation stack. */
  showBack?: boolean;
}

/** Reusable brand-gradient header band with a rounded bottom edge. */
export function GradientHeader({ title, subtitle, children, extraBottomPadding = 0, showBack = false }: GradientHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: insets.top + 22,
        paddingBottom: 26 + extraBottomPadding,
        paddingHorizontal: spacing.lg,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
      {showBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 6 }} hitSlop={8}>
          <Text style={{ color: "#fff", fontSize: 26, fontWeight: "300" }}>‹</Text>
        </TouchableOpacity>
      )}
      {subtitle ? (
        <Text style={{ fontSize: fontSize.sm, color: "rgba(255,255,255,0.85)" }}>{subtitle}</Text>
      ) : null}
      <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: "#fff", marginTop: subtitle ? 2 : 0 }}>
        {title}
      </Text>
      {children}
    </LinearGradient>
  );
}
