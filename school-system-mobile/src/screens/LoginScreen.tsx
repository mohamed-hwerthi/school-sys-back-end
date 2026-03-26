import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

export default function LoginScreen() {
  const { login, verify2FA, twoFactorPending, cancelTwoFactor } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
    setLoading(true);
    try {
      await login({ email: demoEmail, password: demoPassword });
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  if (twoFactorPending) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: spacing.xl }}>
        <View style={{ alignItems: "center", marginBottom: spacing.xl }}>
          <Text style={{ fontSize: fontSize.xxl, fontWeight: "800", color: colors.primary }}>Verification 2FA</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.sm, textAlign: "center" }}>
            Saisissez le code de votre application d'authentification
          </Text>
        </View>

        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md }}>
            <Text style={{ color: colors.error, fontSize: fontSize.sm }}>{error}</Text>
          </View>
        )}

        <TextInput
          value={totpCode}
          onChangeText={(t) => setTotpCode(t.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          style={{
            borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
            padding: spacing.md, fontSize: fontSize.xl, textAlign: "center",
            letterSpacing: 8, fontWeight: "700", marginBottom: spacing.lg,
          }}
        />

        <TouchableOpacity
          onPress={handleVerify2FA}
          disabled={loading || totpCode.length !== 6}
          style={{
            backgroundColor: colors.primary, borderRadius: borderRadius.md,
            padding: spacing.md, alignItems: "center", opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700", fontSize: fontSize.md }}>Verifier</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={cancelTwoFactor} style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <Text style={{ color: colors.primary, fontWeight: "600", fontSize: fontSize.sm }}>Retour a la connexion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: spacing.xl }} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View style={{
            width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primary,
            justifyContent: "center", alignItems: "center", marginBottom: spacing.md,
            shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
          }}>
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900" }}>E</Text>
          </View>
          <Text style={{ fontSize: fontSize.xxl, fontWeight: "800", color: colors.text }}>EcoleNet</Text>
          <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textMuted, letterSpacing: 2, marginTop: 2 }}>ESPACE PARENT</Text>
        </View>

        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md }}>
            <Text style={{ color: colors.error, fontSize: fontSize.sm }}>{error}</Text>
          </View>
        )}

        {/* Email */}
        <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.text, marginBottom: 6 }}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="nom@ecole.fr"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
            padding: spacing.md, fontSize: fontSize.md, marginBottom: spacing.md, backgroundColor: colors.surface,
          }}
        />

        {/* Password */}
        <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.text, marginBottom: 6 }}>Mot de passe</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          style={{
            borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
            padding: spacing.md, fontSize: fontSize.md, marginBottom: spacing.lg, backgroundColor: colors.surface,
          }}
        />

        {/* Login button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: colors.primary, borderRadius: borderRadius.md,
            padding: spacing.md, alignItems: "center", opacity: loading ? 0.7 : 1,
            shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
          }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700", fontSize: fontSize.md }}>Se connecter</Text>}
        </TouchableOpacity>

        {/* Demo accounts */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, textAlign: "center", marginBottom: spacing.md, fontWeight: "600" }}>COMPTES DEMO</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {[
              { label: "Parent", email: "parent@school.dev", password: "parent123", color: "#0ea5e9" },
              { label: "Admin", email: "admin@school.dev", password: "admin123", color: "#eab308" },
              { label: "Directeur", email: "directeur@school.dev", password: "directeur123", color: "#3b82f6" },
            ].map((d) => (
              <TouchableOpacity
                key={d.email}
                onPress={() => handleDemoLogin(d.email, d.password)}
                disabled={loading}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.lg,
                  backgroundColor: d.color + "15", borderWidth: 1, borderColor: d.color + "30",
                }}
              >
                <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: d.color }}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
