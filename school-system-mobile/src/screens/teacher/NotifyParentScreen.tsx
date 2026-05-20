import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { parentNotifyApi, type NotifyChannel } from "@/api/parent-notify.api";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";
import type { TeacherClassesStackParamList } from "@/types/teacher";

type NotifyRoute = RouteProp<TeacherClassesStackParamList, "NotifyParent">;

const CHANNELS: { value: NotifyChannel; label: string; icon: string }[] = [
  { value: "EMAIL", label: "E-mail", icon: "✉️" },
  { value: "SMS", label: "SMS", icon: "💬" },
  { value: "PUSH", label: "Push", icon: "🔔" },
];

export default function NotifyParentScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<NotifyRoute>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [channels, setChannels] = useState<NotifyChannel[]>(["EMAIL"]);

  const toggle = (c: NotifyChannel) =>
    setChannels((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const mutation = useMutation({
    mutationFn: () =>
      parentNotifyApi.notifyParent(params.studentId, {
        message: message.trim(),
        channels,
        triggeredByUserId: user?.id,
      }),
    onSuccess: () =>
      Alert.alert("Message envoyé", "La notification a été transmise aux parents.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]),
    onError: (e: unknown) => Alert.alert("Erreur", e instanceof Error ? e.message : "Échec de l'envoi."),
  });

  const handleSend = () => {
    if (!message.trim()) { Alert.alert("Message vide", "Saisissez un message."); return; }
    if (channels.length === 0) { Alert.alert("Aucun canal", "Choisissez au moins un canal."); return; }
    mutation.mutate();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Contacter les parents de</Text>
        <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.text, marginBottom: spacing.lg }}>
          {params.studentName}
        </Text>

        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.text, letterSpacing: 0.5, marginBottom: 6 }}>
          MESSAGE
        </Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Votre message aux parents..."
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
          style={{
            backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14,
            padding: spacing.md, fontSize: fontSize.md, color: colors.text, minHeight: 120,
          }}
        />

        <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.text, letterSpacing: 0.5, marginTop: spacing.lg, marginBottom: 6 }}>
          CANAUX
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          {CHANNELS.map((c) => {
            const active = channels.includes(c.value);
            return (
              <TouchableOpacity
                key={c.value}
                onPress={() => toggle(c.value)}
                activeOpacity={0.7}
                style={{
                  flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 14,
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderWidth: 1, borderColor: active ? colors.primary : colors.border,
                }}
              >
                <Text style={{ fontSize: 18 }}>{c.icon}</Text>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: active ? "#fff" : colors.textSecondary, marginTop: 4 }}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.md, lineHeight: 16 }}>
          ℹ️ La livraison effective dépend de la configuration du serveur (SMS et e-mail peuvent être désactivés
          en environnement de dev).
        </Text>
      </ScrollView>

      <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border }}>
        <TouchableOpacity onPress={handleSend} disabled={mutation.isPending} activeOpacity={0.85}>
          <View style={{
            backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15,
            alignItems: "center", opacity: mutation.isPending ? 0.7 : 1,
          }}>
            {mutation.isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: "#fff", fontWeight: "800", fontSize: fontSize.md }}>Envoyer</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
