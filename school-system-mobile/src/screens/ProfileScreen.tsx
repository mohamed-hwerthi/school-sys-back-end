import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from "react-native";
import { confirmAction } from "@/utils/confirm";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSchool } from "@/context/SchoolContext";
import { useTheme } from "@/context/ThemeContext";
import { useBiometricSettings } from "@/hooks/useBiometricSettings";
import { spacing, fontSize, borderRadius, gradients, shadows } from "@/constants/theme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface MenuItem {
  icon: IoniconName;
  label: string;
  tint?: string;
  onPress?: () => void;
}

function ToggleRow({ icon, label, tint, value, onValueChange, disabled }: {
  icon: IoniconName; label: string; tint?: string;
  value: boolean; onValueChange: () => void; disabled?: boolean;
}) {
  const { colors } = useTheme();
  const color = tint ?? colors.primary;
  return (
    <View style={{
      flexDirection: "row", alignItems: "center", padding: spacing.md,
      backgroundColor: colors.background, borderRadius: 14, marginBottom: 8, ...shadows.soft,
      opacity: disabled ? 0.5 : 1,
    }}>
      <View style={{
        width: 36, height: 36, borderRadius: 12, backgroundColor: color + "15",
        justifyContent: "center", alignItems: "center", marginRight: spacing.md,
      }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, flex: 1 }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.surfaceHover, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

function MenuRow({ icon, label, tint, onPress }: MenuItem) {
  const { colors } = useTheme();
  const color = tint ?? colors.primary;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress ?? (() => Alert.alert("Bientôt disponible", `« ${label} » arrive prochainement.`))}
      style={{
        flexDirection: "row", alignItems: "center", padding: spacing.md,
        backgroundColor: colors.background, borderRadius: 14, marginBottom: 8, ...shadows.soft,
      }}
    >
      <View style={{
        width: 36, height: 36, borderRadius: 12, backgroundColor: color + "15",
        justifyContent: "center", alignItems: "center", marginRight: spacing.md,
      }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, flex: 1 }}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

/**
 * Shared profile + settings screen. Used as the "Profil" tab of the
 * teacher/admin/director navigators.
 */
export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { school } = useSchool();
  const insets = useSafeAreaInsets();
  const biometric = useBiometricSettings();
  const theme = useTheme();
  const { colors } = theme;

  const handleLogout = () => {
    confirmAction({
      title: "Déconnexion",
      message: "Êtes-vous sûr de vouloir vous déconnecter ?",
      confirmLabel: "Déconnecter",
      destructive: true,
    }, () => { void logout(); });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Gradient profile card */}
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 32,
            paddingBottom: 36,
            paddingHorizontal: spacing.lg,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            alignItems: "center",
          }}
        >
          <View style={{
            width: 84, height: 84, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.22)",
            justifyContent: "center", alignItems: "center", marginBottom: spacing.md,
          }}>
            <Text style={{ fontSize: 32, fontWeight: "800", color: "#fff" }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Text>
          </View>
          <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: "#fff" }}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
            {user?.email}
          </Text>
          <View style={{
            backgroundColor: "rgba(255,255,255,0.22)", borderRadius: borderRadius.full,
            paddingHorizontal: 14, paddingVertical: 5, marginTop: spacing.sm,
          }}>
            <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: "#fff", letterSpacing: 0.5 }}>
              {user?.role?.replace(/_/g, " ")}
            </Text>
          </View>
        </LinearGradient>

        <View style={{ padding: spacing.lg }}>
          {/* School */}
          {school && (
            <View style={{
              flexDirection: "row", alignItems: "center", padding: spacing.md,
              backgroundColor: colors.background, borderRadius: 16, marginBottom: spacing.lg, ...shadows.soft,
            }}>
              <View style={{
                width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary + "12",
                justifyContent: "center", alignItems: "center", marginRight: spacing.md,
              }}>
                <Ionicons name="school" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>École</Text>
                <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                  {school.name}
                </Text>
              </View>
            </View>
          )}

          {/* Account section */}
          <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm }}>
            COMPTE
          </Text>
          <MenuRow icon="person-circle-outline" label="Modifier mon profil" />
          <MenuRow icon="shield-checkmark-outline" label="Sécurité & 2FA" tint={colors.info} />
          <MenuRow icon="phone-portrait-outline" label="Sessions actives" tint={colors.info} />
          <MenuRow icon="notifications-outline" label="Notifications" tint={colors.warning} />

          {/* Preferences */}
          <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginTop: spacing.lg, marginBottom: spacing.sm }}>
            PRÉFÉRENCES
          </Text>
          <ToggleRow
            icon="moon-outline"
            label="Thème sombre"
            tint={colors.text}
            value={theme.scheme === "dark"}
            onValueChange={() => theme.setMode(theme.scheme === "dark" ? "light" : "dark")}
          />
          <MenuRow icon="language-outline" label="Langue" tint={colors.success} />
          <ToggleRow
            icon="finger-print-outline"
            label={biometric.available ? "Connexion biométrique" : "Biométrie indisponible"}
            tint={colors.primary}
            value={biometric.enabled}
            onValueChange={biometric.toggle}
            disabled={biometric.loading}
          />

          {/* Support */}
          <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, marginTop: spacing.lg, marginBottom: spacing.sm }}>
            ASSISTANCE
          </Text>
          <MenuRow icon="help-circle-outline" label="Aide & support" />
          <MenuRow icon="document-text-outline" label="Conditions d'utilisation" />
          <MenuRow icon="information-circle-outline" label="À propos" />

          {/* Logout */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            style={{
              flexDirection: "row", alignItems: "center", justifyContent: "center",
              padding: spacing.md, backgroundColor: colors.error + "10", borderRadius: 14,
              borderWidth: 1, borderColor: colors.error + "20", marginTop: spacing.lg,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.error, marginLeft: 8 }}>
              Se déconnecter
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, textAlign: "center", marginTop: spacing.xl }}>
            EcoleNet Mobile v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
