import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useSchool } from "@/context/SchoolContext";
import { useBiometricSettings } from "@/hooks/useBiometricSettings";
import { authenticateBiometric } from "@/utils/biometric";
import { storage } from "@/utils/storage";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius, gradients, shadows } from "@/constants/theme";

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login, loginWithBiometric, verify2FA, twoFactorPending, cancelTwoFactor } = useAuth();
  const { available: bioAvailable, enabled: bioEnabled } = useBiometricSettings();
  const [hasRefresh, setHasRefresh] = useState(false);

  useEffect(() => {
    (async () => { setHasRefresh(!!(await storage.getItem("refreshToken"))); })();
  }, []);

  const showBiometric = bioAvailable && bioEnabled && hasRefresh;
  const { school, clearSchool } = useSchool();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBiometricLogin = async () => {
    setError(null);
    const ok = await authenticateBiometric("Se connecter avec biométrie");
    if (!ok) return;
    setLoading(true);
    try {
      await loginWithBiometric();
    } catch (err: any) {
      setError(err?.message || "Échec de la connexion biométrique");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorPending || totpCode.length !== 6) return;
    setError(null);
    setLoading(true);
    try {
      await verify2FA(twoFactorPending.userId, totpCode);
    } catch (err: any) {
      setError(err.message || "Code invalide");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    fontSize: fontSize.md,
    color: colors.text,
  };

  const errorBox = error ? (
    <View style={{
      flexDirection: "row", alignItems: "center", gap: 8,
      backgroundColor: "#fef2f2", borderRadius: 12, padding: spacing.md, marginBottom: spacing.md,
    }}>
      <Text style={{ fontSize: 14 }}>⚠️</Text>
      <Text style={{ color: colors.error, fontSize: fontSize.sm, flex: 1 }}>{error}</Text>
    </View>
  ) : null;

  // ---- 2FA verification ----
  if (twoFactorPending) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 56, paddingBottom: 72, paddingHorizontal: spacing.lg,
            borderBottomLeftRadius: 36, borderBottomRightRadius: 36, alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>🔐</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>Vérification 2FA</Text>
          <Text style={{ fontSize: fontSize.sm, color: "rgba(255,255,255,0.85)", marginTop: 4, textAlign: "center" }}>
            Saisissez le code de votre application d'authentification
          </Text>
        </LinearGradient>

        <View style={{
          marginHorizontal: spacing.lg, marginTop: -44,
          backgroundColor: colors.background, borderRadius: 24, padding: spacing.lg, ...shadows.card,
        }}>
          {errorBox}
          <TextInput
            value={totpCode}
            onChangeText={(t) => setTotpCode(t.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={6}
            style={{
              ...inputStyle, fontSize: fontSize.xxl, textAlign: "center",
              letterSpacing: 10, fontWeight: "800", marginBottom: spacing.lg,
            }}
          />
          <TouchableOpacity onPress={handleVerify2FA} disabled={loading || totpCode.length !== 6} activeOpacity={0.85}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 14, paddingVertical: 15, alignItems: "center",
                opacity: loading || totpCode.length !== 6 ? 0.6 : 1,
              }}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "800", fontSize: fontSize.md }}>Vérifier</Text>}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelTwoFactor} style={{ marginTop: spacing.md, alignItems: "center" }}>
            <Text style={{ color: colors.primary, fontWeight: "600", fontSize: fontSize.sm }}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ---- Login ----
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.xl }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: insets.top + 52, paddingBottom: 84, paddingHorizontal: spacing.lg,
              borderBottomLeftRadius: 36, borderBottomRightRadius: 36, alignItems: "center",
            }}
          >
            <View style={{
              width: 72, height: 72, borderRadius: 24, backgroundColor: colors.background,
              justifyContent: "center", alignItems: "center", marginBottom: spacing.md, ...shadows.card,
            }}>
              <Text style={{ color: colors.primary, fontSize: 32, fontWeight: "900" }}>E</Text>
            </View>
            <Text style={{ fontSize: 27, fontWeight: "800", color: "#fff", letterSpacing: 0.3 }}>EcoleNet</Text>
            <View style={{
              backgroundColor: "rgba(255,255,255,0.2)", borderRadius: borderRadius.full,
              paddingHorizontal: 12, paddingVertical: 3, marginTop: 8,
            }}>
              <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: "#fff", letterSpacing: 2 }}>
                ESPACE MOBILE
              </Text>
            </View>
          </LinearGradient>

          {/* Login card */}
          <View style={{
            marginHorizontal: spacing.lg, marginTop: -52,
            backgroundColor: colors.background, borderRadius: 24, padding: spacing.lg, ...shadows.card,
          }}>
            {/* Selected school */}
            {school && (
              <View style={{
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: spacing.md,
                paddingVertical: 10, marginBottom: spacing.lg,
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                  <Text style={{ fontSize: 16 }}>🏫</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }} numberOfLines={1}>
                    {school.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => clearSchool()}>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.primary }}>Changer</Text>
                </TouchableOpacity>
              </View>
            )}

            {errorBox}

            {/* Biometric quick login */}
            {showBiometric && (
              <>
                <TouchableOpacity
                  onPress={handleBiometricLogin}
                  disabled={loading}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "center",
                    backgroundColor: colors.primary + "12", borderRadius: 14, paddingVertical: 14,
                    borderWidth: 1, borderColor: colors.primary + "25", marginBottom: spacing.md,
                  }}
                >
                  <Ionicons name="finger-print" size={22} color={colors.primary} />
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.primary, marginLeft: 10 }}>
                    Connexion biométrique
                  </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginHorizontal: 10 }}>
                    OU AVEC VOS IDENTIFIANTS
                  </Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                </View>
              </>
            )}

            {/* Email */}
            <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.text, marginBottom: 6 }}>E-MAIL</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="nom@ecole.fr"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ ...inputStyle, marginBottom: spacing.md }}
            />

            {/* Password */}
            <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.text, marginBottom: 6 }}>MOT DE PASSE</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={{ ...inputStyle, marginBottom: spacing.lg }}
            />

            {/* Login button */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 14, paddingVertical: 15, alignItems: "center", opacity: loading ? 0.7 : 1 }}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={{ color: "#fff", fontWeight: "800", fontSize: fontSize.md }}>Se connecter</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
