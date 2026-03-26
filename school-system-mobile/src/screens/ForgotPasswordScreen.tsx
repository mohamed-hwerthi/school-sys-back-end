import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { authApi } from "@/api/auth.api";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

export default function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl, backgroundColor: colors.background }}>
        <Text style={{ fontSize: 48, marginBottom: spacing.md }}>✉️</Text>
        <Text style={{ fontSize: fontSize.xl, fontWeight: "700", color: colors.text, textAlign: "center" }}>Email envoye !</Text>
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", marginTop: spacing.sm }}>
          Verifiez votre boite mail pour reinitialiser votre mot de passe.
        </Text>
        <TouchableOpacity onPress={onBack} style={{ marginTop: spacing.xl }}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>Retour a la connexion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: spacing.xl, backgroundColor: colors.background }}>
      <Text style={{ fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginBottom: spacing.sm }}>Mot de passe oublie</Text>
      <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xl }}>
        Entrez votre email pour recevoir un lien de reinitialisation.
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="nom@ecole.fr"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
          padding: spacing.md, fontSize: fontSize.md, marginBottom: spacing.lg, backgroundColor: colors.surface,
        }}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading || !email.trim()}
        style={{
          backgroundColor: colors.primary, borderRadius: borderRadius.md,
          padding: spacing.md, alignItems: "center", opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700" }}>Envoyer le lien</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack} style={{ marginTop: spacing.lg, alignItems: "center" }}>
        <Text style={{ color: colors.primary, fontWeight: "600", fontSize: fontSize.sm }}>Retour a la connexion</Text>
      </TouchableOpacity>
    </View>
  );
}
