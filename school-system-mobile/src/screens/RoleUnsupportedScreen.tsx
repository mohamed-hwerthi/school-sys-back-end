import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { confirmAction } from "@/utils/confirm";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

/**
 * Shown when a user whose role has no mobile experience logs in
 * (ADMIN, COMPTABLE, SUPER_ADMIN). They manage the school from the web app.
 */
export default function RoleUnsupportedScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    confirmAction({
      title: "Déconnexion",
      message: "Êtes-vous sûr de vouloir vous déconnecter ?",
      confirmLabel: "Déconnecter",
      destructive: true,
    }, () => { void logout(); });
  };

  const roleLabel = user?.role?.replace(/_/g, " ") ?? "ce rôle";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
        <Text style={{ fontSize: 56, marginBottom: spacing.md }}>📱</Text>
        <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.text, textAlign: "center" }}>
          Espace non disponible sur mobile
        </Text>
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", marginTop: spacing.sm }}>
          L'application mobile est réservée aux parents, enseignants et directeurs.
          Le rôle « {roleLabel} » se gère depuis l'application web.
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: spacing.xl, paddingHorizontal: 24, paddingVertical: 12,
            backgroundColor: colors.error + "10", borderRadius: borderRadius.md,
            borderWidth: 1, borderColor: colors.error + "20",
          }}
        >
          <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.error }}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
