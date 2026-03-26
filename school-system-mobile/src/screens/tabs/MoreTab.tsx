import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

export default function MoreTab() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Deconnexion", "Etes-vous sur de vouloir vous deconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Deconnecter", style: "destructive", onPress: () => logout() },
    ]);
  };

  const menuItems = [
    { icon: "👤", label: "Mon profil", onPress: () => {} },
    { icon: "🔔", label: "Notifications", onPress: () => {} },
    { icon: "🔒", label: "Securite & 2FA", onPress: () => {} },
    { icon: "🌙", label: "Theme sombre", onPress: () => {} },
    { icon: "🌐", label: "Langue", onPress: () => {} },
    { icon: "❓", label: "Aide & Support", onPress: () => {} },
    { icon: "📋", label: "Conditions d'utilisation", onPress: () => {} },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg }}>
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
          <Text style={{ fontSize: fontSize.md, color: colors.textMuted }}>›</Text>
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
