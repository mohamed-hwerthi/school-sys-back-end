import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GradientHeader } from "@/components/GradientHeader";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { TeacherMoreStackParamList } from "@/types/teacher";

type Nav = NativeStackNavigationProp<TeacherMoreStackParamList, "MoreMenu">;

type MenuTarget = "Discipline" | "QuizList" | "Messages" | "Notifications" | "Profil";

const ITEMS: { icon: string; label: string; screen: MenuTarget }[] = [
  { icon: "🛡️", label: "Discipline", screen: "Discipline" },
  { icon: "🎯", label: "Quiz", screen: "QuizList" },
  { icon: "💬", label: "Messagerie", screen: "Messages" },
  { icon: "🔔", label: "Notifications", screen: "Notifications" },
  { icon: "👤", label: "Mon profil", screen: "Profil" },
];

export default function TeacherMoreScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <GradientHeader title="Plus" subtitle="Outils & compte" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
        {ITEMS.map((item) => (
          <TouchableOpacity
            key={item.screen}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.screen)}
            style={{
              flexDirection: "row", alignItems: "center",
              backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, marginBottom: 10, ...shadows.soft,
            }}
          >
            <View style={{
              width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary + "12",
              justifyContent: "center", alignItems: "center", marginRight: spacing.md,
            }}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            </View>
            <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 }}>
              {item.label}
            </Text>
            <Text style={{ fontSize: fontSize.xl, color: colors.textMuted }}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
