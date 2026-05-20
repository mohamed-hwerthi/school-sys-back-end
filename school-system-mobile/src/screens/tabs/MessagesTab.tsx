import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/api/messages.api";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "A l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function getInitials(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function MessagesTab() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const {
    data: messages = [],
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["inbox", user?.id],
    queryFn: () => messagesApi.getInbox(user!.id),
    enabled: !!user?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => messagesApi.markAsRead(messageId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", user?.id] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (data: { recipientId: string; subject: string; body: string }) =>
      messagesApi.send({
        senderId: user!.id,
        recipientIds: [data.recipientId],
        subject: data.subject,
        body: data.body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", user?.id] });
      setShowCompose(false);
      resetComposeForm();
      Alert.alert("Succes", "Message envoye avec succes.");
    },
    onError: (error: Error) => {
      Alert.alert("Erreur", error.message || "Impossible d'envoyer le message.");
    },
  });

  const resetComposeForm = useCallback(() => {
    setComposeRecipient("");
    setComposeSubject("");
    setComposeBody("");
  }, []);

  const handleOpenMessage = useCallback(
    (msg: Message) => {
      setSelectedMessage(msg);
      if (!msg.read) {
        markAsReadMutation.mutate(msg.id);
      }
    },
    [markAsReadMutation]
  );

  const handleSend = useCallback(() => {
    const recipientId = composeRecipient.trim();
    if (!recipientId) {
      Alert.alert("Erreur", "Veuillez entrer un ID destinataire valide.");
      return;
    }
    if (!composeSubject.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un sujet.");
      return;
    }
    if (!composeBody.trim()) {
      Alert.alert("Erreur", "Veuillez entrer le contenu du message.");
      return;
    }
    sendMutation.mutate({
      recipientId,
      subject: composeSubject.trim(),
      body: composeBody.trim(),
    });
  }, [composeRecipient, composeSubject, composeBody, sendMutation]);

  const unreadCount = messages.filter((m: Message) => !m.read).length;

  if (error) {
    return <ErrorView message={(error as Error).message} onRetry={() => refetch()} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text }}>
          Messages
        </Text>
        {unreadCount > 0 && (
          <Text style={{ fontSize: fontSize.sm, color: colors.primary, marginTop: 2 }}>
            {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
          </Text>
        )}
      </View>

      {/* Messages List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl * 3,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        {isLoading ? (
          <ListSkeleton count={5} />
        ) : messages.length === 0 ? (
          <EmptyState
            icon="💬"
            title="Aucun message"
            subtitle="Votre boite de reception est vide."
          />
        ) : (
          messages.map((msg: Message) => (
            <TouchableOpacity
              key={msg.id}
              onPress={() => handleOpenMessage(msg)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                backgroundColor: msg.read ? colors.surface : colors.primary + "08",
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                marginBottom: spacing.sm,
                borderWidth: 1,
                borderColor: msg.read ? colors.border : colors.primary + "25",
                borderLeftWidth: msg.read ? 1 : 3,
                borderLeftColor: msg.read ? colors.border : colors.primary,
              }}
            >
              {/* Avatar */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: msg.read ? colors.textMuted + "20" : colors.primary + "15",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: "700",
                    color: msg.read ? colors.textMuted : colors.primary,
                  }}
                >
                  {getInitials(msg.senderName)}
                </Text>
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSize.sm,
                      fontWeight: msg.read ? "500" : "700",
                      color: colors.text,
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {msg.senderName || "Inconnu"}
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginLeft: spacing.sm }}>
                    {formatDate(msg.createdAt)}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: msg.read ? "400" : "600",
                    color: colors.text,
                  }}
                  numberOfLines={1}
                >
                  {msg.subject}
                </Text>
                <Text
                  style={{
                    fontSize: fontSize.xs,
                    color: colors.textSecondary,
                    marginTop: 2,
                    lineHeight: 16,
                  }}
                  numberOfLines={2}
                >
                  {msg.body}
                </Text>
              </View>

              {/* Unread indicator */}
              {!msg.read && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.primary,
                    alignSelf: "center",
                    marginLeft: spacing.sm,
                  }}
                />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Floating Compose Button */}
      <TouchableOpacity
        onPress={() => setShowCompose(true)}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          bottom: spacing.xl,
          right: spacing.lg,
          width: 56,
          height: 56,
          borderRadius: 18,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Text style={{ fontSize: 24, color: "#fff" }}>✏️</Text>
      </TouchableOpacity>

      {/* Message Detail Modal */}
      <Modal
        visible={!!selectedMessage}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedMessage(null)}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Detail Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <TouchableOpacity
              onPress={() => setSelectedMessage(null)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
                marginRight: spacing.md,
              }}
            >
              <Text style={{ fontSize: fontSize.md, color: colors.text }}>←</Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: fontSize.lg,
                fontWeight: "700",
                color: colors.text,
                flex: 1,
              }}
              numberOfLines={1}
            >
              Message
            </Text>
          </View>

          {selectedMessage && (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: spacing.lg }}
            >
              {/* Sender info */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.lg }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: colors.primary + "15",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: spacing.md,
                  }}
                >
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.primary }}>
                    {getInitials(selectedMessage.senderName)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                    {selectedMessage.senderName || "Inconnu"}
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                    {selectedMessage.createdAt
                      ? new Date(selectedMessage.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </Text>
                </View>
              </View>

              {/* Subject */}
              <Text
                style={{
                  fontSize: fontSize.xl,
                  fontWeight: "800",
                  color: colors.text,
                  marginBottom: spacing.md,
                }}
              >
                {selectedMessage.subject}
              </Text>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginBottom: spacing.lg,
                }}
              />

              {/* Body */}
              <Text
                style={{
                  fontSize: fontSize.md,
                  color: colors.text,
                  lineHeight: 24,
                }}
              >
                {selectedMessage.body}
              </Text>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Compose Modal */}
      <Modal
        visible={showCompose}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowCompose(false);
          resetComposeForm();
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: colors.background }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Compose Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowCompose(false);
                resetComposeForm();
              }}
            >
              <Text style={{ fontSize: fontSize.md, color: colors.textSecondary }}>Annuler</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>
              Nouveau message
            </Text>
            <TouchableOpacity
              onPress={handleSend}
              disabled={sendMutation.isPending}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.md,
                opacity: sendMutation.isPending ? 0.6 : 1,
              }}
            >
              {sendMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: "#fff" }}>
                  Envoyer
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Compose Form */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: spacing.lg }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Recipient */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: fontSize.xs,
                  fontWeight: "600",
                  color: colors.textMuted,
                  marginBottom: spacing.xs,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Destinataire (ID)
              </Text>
              <TextInput
                value={composeRecipient}
                onChangeText={setComposeRecipient}
                placeholder="ID du destinataire"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  fontSize: fontSize.md,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            </View>

            {/* Subject */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: fontSize.xs,
                  fontWeight: "600",
                  color: colors.textMuted,
                  marginBottom: spacing.xs,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Sujet
              </Text>
              <TextInput
                value={composeSubject}
                onChangeText={setComposeSubject}
                placeholder="Objet du message"
                placeholderTextColor={colors.textMuted}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  fontSize: fontSize.md,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            </View>

            {/* Body */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: fontSize.xs,
                  fontWeight: "600",
                  color: colors.textMuted,
                  marginBottom: spacing.xs,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Message
              </Text>
              <TextInput
                value={composeBody}
                onChangeText={setComposeBody}
                placeholder="Ecrivez votre message ici..."
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  fontSize: fontSize.md,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 160,
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
