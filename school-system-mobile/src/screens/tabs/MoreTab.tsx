import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { confirmAction } from "@/utils/confirm";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

export default function MoreTab() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // MoreTab is mostly static, but we briefly show the indicator for UX consistency
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleLogout = () => {
    confirmAction({
      title: "Déconnexion",
      message: "Êtes-vous sûr de vouloir vous déconnecter ?",
      confirmLabel: "Déconnecter",
      destructive: true,
    }, () => { void logout(); });
  };

  const menuItems = [
    { icon: "\uD83D\uDC64", label: "Mon profil", onPress: () => {} },
    { icon: "\uD83D\uDD14", label: "Notifications", onPress: () => navigation.navigate("Notifications") },
    { icon: "\uD83D\uDCB3", label: "Paiements", onPress: () => navigation.navigate("PaymentHistory") },
    { icon: "\uD83D\uDCCB", label: "Absences", onPress: () => navigation.navigate("Absences") },
    { icon: "\u26A0\uFE0F", label: "Discipline", onPress: () => navigation.navigate("Discipline") },
    { icon: "\uD83D\uDCDA", label: "Devoirs", onPress: () => navigation.navigate("Homework") },
    { icon: "\uD83D\uDCD6", label: "Ressources", onPress: () => navigation.navigate("Resources") },
    { icon: "\uD83D\uDCC4", label: "Bulletins", onPress: () => navigation.navigate("Bulletin") },
    { icon: "\uD83C\uDFAF", label: "Quiz", onPress: () => navigation.navigate("QuizList") },
    { icon: "\uD83C\uDF7D\uFE0F", label: "Cantine", onPress: () => navigation.navigate("Cantine") },
    { icon: "\uD83D\uDE8C", label: "Transport", onPress: () => navigation.navigate("Transport") },
    { icon: "\uD83D\uDD12", label: "Securite & 2FA", onPress: () => {} },
    { icon: "\uD83C\uDF19", label: "Theme sombre", onPress: () => {} },
    { icon: "\uD83C\uDF10", label: "Langue", onPress: () => {} },
    { icon: "\u2753", label: "Aide & Support", onPress: () => {} },
    { icon: "\uD83D\uDCDD", label: "Conditions d'utilisation", onPress: () => {} },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {/* Profile card */}
      <View style={{
        backgroundColor: colors.primary, borderRadius: borderRadius.xl, padding: spacing.xl,
        marginBottom: spacing.xl, alignItems: "center",
      }}>
        <View style={{
          width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)",
          justifyContent: "center", alignItems: "center", marginBottom: spacing.md,
        }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#fff" }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Text>
        </View>
        <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: "#fff" }}>{user?.firstName} {user?.lastName}</Text>
        <Text style={{ fontSize: fontSize.sm, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{user?.email}</Text>
        <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: borderRadius.full, paddingHorizontal: 12, paddingVertical: 4, marginTop: spacing.sm }}>
          <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: "#fff" }}>{user?.role?.replace(/_/g, " ")}</Text>
        </View>
      </View>

      {/* Menu items */}
      {menuItems.map((item, i) => (
        <TouchableOpacity
          key={i}
          onPress={item.onPress}
          style={{
            flexDirection: "row", alignItems: "center", padding: spacing.md,
            backgroundColor: colors.surface, borderRadius: borderRadius.md, marginBottom: spacing.sm,
          }}
        >
          <Text style={{ fontSize: 20, marginRight: spacing.md }}>{item.icon}</Text>
          <Text style={{ fontSize: fontSize.md, fontWeight: "500", color: colors.text, flex: 1 }}>{item.label}</Text>
          <Text style={{ fontSize: fontSize.md, color: colors.textMuted }}>{"\u203A"}</Text>
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          flexDirection: "row", alignItems: "center", justifyContent: "center",
          padding: spacing.md, backgroundColor: colors.error + "10", borderRadius: borderRadius.md,
          marginTop: spacing.md, borderWidth: 1, borderColor: colors.error + "20",
        }}
      >
        <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.error }}>Se deconnecter</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, textAlign: "center", marginTop: spacing.xl }}>EcoleNet Mobile v1.0.0</Text>
    </ScrollView>
  );
}
