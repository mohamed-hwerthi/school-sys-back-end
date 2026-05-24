import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  appreciationTemplatesApi,
  type AppreciationTemplate,
  type UpsertAppreciationTemplate,
} from "@/api/appreciation-templates.api";
import { GradientHeader } from "@/components/GradientHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";

const TAG_LABELS: { value: string; label: string }[] = [
  { value: "POSITIF", label: "Positif" },
  { value: "NEUTRE", label: "Neutre" },
  { value: "NEGATIF", label: "Négatif" },
];

function tagColor(tag: string, palette: { success: string; warning: string; error: string; textMuted: string }) {
  if (tag === "POSITIF") return palette.success;
  if (tag === "NEGATIF") return palette.error;
  if (tag === "NEUTRE") return palette.warning;
  return palette.textMuted;
}

/** MOB-FUNC-023 — gestion de la bibliothèque de modèles d'appréciations. */
export default function AppreciationTemplatesScreen() {
  const { colors } = useTheme();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<AppreciationTemplate | null>(null);
  const [creating, setCreating] = useState(false);

  const q = useQuery({
    queryKey: ["appreciation-templates"],
    queryFn: appreciationTemplatesApi.list,
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => appreciationTemplatesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appreciation-templates"] }),
  });

  if (q.isLoading) return <DashboardSkeleton chartCount={1} />;
  if (q.isError) return <ErrorView onRetry={() => q.refetch()} />;

  const items = q.data ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={q.isFetching} onRefresh={() => q.refetch()} tintColor={colors.primary} />}
      >
        <GradientHeader subtitle="Mes appréciations" title="Modèles" extraBottomPadding={20} />

        <View style={{ padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm }}>
            Phrases types réutilisables lors de la saisie de bulletins.
          </Text>

          {items.length === 0 ? (
            <EmptyState
              icon="📝"
              title="Aucun modèle"
              subtitle="Créez votre première phrase type pour gagner du temps lors des bulletins."
            />
          ) : (
            items.map((t) => {
              const c = tagColor(t.tag, colors);
              return (
                <View
                  key={t.id}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: borderRadius.lg,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                    borderLeftWidth: 4,
                    borderLeftColor: c,
                    ...shadows.soft,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                    <Text style={{ flex: 1, fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                      {t.libelle}
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 10,
                        backgroundColor: c + "15",
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: "800", color: c }}>{t.tag}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm }}>
                    {t.contenu}
                  </Text>
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <TouchableOpacity
                      onPress={() => setEditing(t)}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: borderRadius.md,
                        backgroundColor: colors.primary + "15",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.primary }}>
                        Modifier
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          "Supprimer ce modèle ?",
                          t.libelle,
                          [
                            { text: "Annuler", style: "cancel" },
                            { text: "Supprimer", style: "destructive", onPress: () => deleteMut.mutate(t.id) },
                          ],
                        )
                      }
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: borderRadius.md,
                        backgroundColor: colors.error + "15",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.error }}>
                        Supprimer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Bouton "Nouveau modèle" flottant */}
      <TouchableOpacity
        onPress={() => setCreating(true)}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          right: spacing.lg,
          bottom: spacing.lg,
          backgroundColor: colors.primary,
          borderRadius: 28,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          flexDirection: "row",
          alignItems: "center",
          ...shadows.card,
        }}
      >
        <Text style={{ fontSize: 22, color: "#fff", marginRight: 6 }}>+</Text>
        <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: "#fff" }}>Nouveau</Text>
      </TouchableOpacity>

      {/* Modal édition / création */}
      {(creating || editing) && (
        <TemplateEditModal
          existing={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </View>
  );
}

interface EditProps {
  existing: AppreciationTemplate | null;
  onClose: () => void;
}

function TemplateEditModal({ existing, onClose }: EditProps) {
  const { colors } = useTheme();
  const qc = useQueryClient();
  const [libelle, setLibelle] = useState(existing?.libelle ?? "");
  const [contenu, setContenu] = useState(existing?.contenu ?? "");
  const [tag, setTag] = useState<string>(existing?.tag ?? "NEUTRE");

  const mut = useMutation({
    mutationFn: (body: UpsertAppreciationTemplate) =>
      existing
        ? appreciationTemplatesApi.update(existing.id, body)
        : appreciationTemplatesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appreciation-templates"] });
      onClose();
    },
    onError: (e: any) => Alert.alert("Erreur", e?.message ?? "Échec de l'enregistrement."),
  });

  const submit = () => {
    if (!libelle.trim() || !contenu.trim()) {
      Alert.alert("Champs requis", "Libellé et contenu sont obligatoires.");
      return;
    }
    mut.mutate({
      libelle: libelle.trim(),
      contenu: contenu.trim(),
      tag: tag as "POSITIF" | "NEUTRE" | "NEGATIF",
    });
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          padding: spacing.lg,
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            ...shadows.card,
          }}
        >
          <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.text, marginBottom: spacing.md }}>
            {existing ? "Modifier le modèle" : "Nouveau modèle"}
          </Text>

          <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: 4 }}>Libellé court</Text>
          <TextInput
            value={libelle}
            onChangeText={setLibelle}
            maxLength={60}
            placeholder="Ex: Élève sérieux"
            placeholderTextColor={colors.textMuted}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.sm,
              fontSize: fontSize.sm,
              color: colors.text,
              marginBottom: spacing.md,
            }}
          />

          <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: 4 }}>
            Contenu
          </Text>
          <TextInput
            value={contenu}
            onChangeText={setContenu}
            multiline
            numberOfLines={3}
            placeholder="Ex: Travail sérieux et régulier, continue ainsi."
            placeholderTextColor={colors.textMuted}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.sm,
              fontSize: fontSize.sm,
              color: colors.text,
              minHeight: 80,
              textAlignVertical: "top",
              marginBottom: spacing.md,
            }}
          />

          <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: 6 }}>Tonalité</Text>
          <SegmentedControl options={TAG_LABELS} value={tag} onChange={setTag} />

          <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.md,
                backgroundColor: colors.border + "60",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submit}
              disabled={mut.isPending}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.md,
                backgroundColor: colors.primary,
                alignItems: "center",
                opacity: mut.isPending ? 0.6 : 1,
              }}
            >
              <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: "#fff" }}>
                {mut.isPending ? "..." : "Enregistrer"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
