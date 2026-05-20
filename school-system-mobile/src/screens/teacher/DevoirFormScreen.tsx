import { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { homeworkApi, type DevoirInput } from "@/api/homework.api";
import { teacherApi } from "@/api/teacher.api";
import { ChipRow } from "@/components/ChipRow";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";
import { toISODate } from "@/constants/calendar";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize } from "@/constants/theme";
import type { TeacherDevoirsStackParamList } from "@/types/teacher";

type FormRoute = RouteProp<TeacherDevoirsStackParamList, "DevoirForm">;

const inputStyle = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 14,
  paddingHorizontal: spacing.md,
  paddingVertical: 12,
  fontSize: fontSize.md,
  color: colors.text,
};

function Label({ text }: { text: string }) {
  return (
    <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.text, letterSpacing: 0.5, marginBottom: 6, marginTop: spacing.md }}>
      {text}
    </Text>
  );
}

export default function DevoirFormScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<FormRoute>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const editing = !!params.devoirId;

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [classeId, setClasseId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [dateLimite, setDateLimite] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });
  const [pointsMax, setPointsMax] = useState("20");
  const [prefilled, setPrefilled] = useState(false);

  const classesQ = useQuery({ queryKey: ["teacher", "classes"], queryFn: teacherApi.getClasses });
  const modulesQ = useQuery({ queryKey: ["teacher", "modules"], queryFn: teacherApi.getModules });
  const devoirQ = useQuery({
    queryKey: ["homework", "devoir", params.devoirId],
    queryFn: () => homeworkApi.getDevoir(params.devoirId!),
    enabled: editing,
  });

  useEffect(() => {
    if (editing && devoirQ.data && !prefilled) {
      const d = devoirQ.data;
      setTitre(d.titre);
      setDescription(d.description ?? "");
      setClasseId(d.classeId);
      setModuleId(d.moduleId);
      if (d.dateLimite) setDateLimite(new Date(d.dateLimite));
      setPointsMax(String(d.pointsMax ?? 20));
      setPrefilled(true);
    }
  }, [editing, devoirQ.data, prefilled]);

  const classes = classesQ.data ?? [];
  const modules = modulesQ.data ?? [];
  const selectedClass = classes.find((c) => c.id === classeId);
  const moduleOptions = selectedClass ? modules.filter((m) => m.niveauId === selectedClass.niveauId) : [];

  const mutation = useMutation({
    mutationFn: (input: DevoirInput) =>
      editing ? homeworkApi.updateDevoir(params.devoirId!, input) : homeworkApi.createDevoir(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework", "devoirs"] });
      if (editing) queryClient.invalidateQueries({ queryKey: ["homework", "devoir", params.devoirId] });
      Alert.alert(editing ? "Devoir modifié" : "Devoir créé", "Enregistré avec succès.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    },
    onError: (e: unknown) =>
      Alert.alert("Erreur", e instanceof Error ? e.message : "Échec de l'enregistrement."),
  });

  const handleSave = () => {
    if (!titre.trim()) { Alert.alert("Champ requis", "Le titre est obligatoire."); return; }
    if (!classeId) { Alert.alert("Champ requis", "Sélectionnez une classe."); return; }
    const points = Number(pointsMax.trim().replace(",", "."));
    if (Number.isNaN(points) || points <= 0) {
      Alert.alert("Barème invalide", "Le barème doit être un nombre positif.");
      return;
    }
    mutation.mutate({
      titre: titre.trim(),
      description: description.trim() || undefined,
      classeId,
      moduleId: moduleId ?? undefined,
      datePublication: toISODate(new Date()),
      dateLimite: toISODate(dateLimite),
      pointsMax: points,
    });
  };

  if (editing && devoirQ.isLoading) return <DetailSkeleton cardCount={2} />;

  const shiftDate = (days: number) =>
    setDateLimite((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + days);
      return next;
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
        <Label text="TITRE" />
        <TextInput
          value={titre}
          onChangeText={setTitre}
          placeholder="Titre du devoir"
          placeholderTextColor={colors.textMuted}
          style={inputStyle}
        />

        <Label text="DESCRIPTION" />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Consignes (optionnel)"
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
          style={{ ...inputStyle, minHeight: 90 }}
        />

        <Label text="CLASSE" />
        <ChipRow
          items={classes.map((c) => ({ value: c.id, label: c.fullName }))}
          value={classeId}
          onChange={(v) => { setClasseId(v); setModuleId(null); }}
        />

        <Label text="MATIÈRE" />
        {!selectedClass ? (
          <Text style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Choisissez d'abord une classe.</Text>
        ) : moduleOptions.length === 0 ? (
          <Text style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Aucune matière pour ce niveau.</Text>
        ) : (
          <ChipRow
            items={moduleOptions.map((m) => ({ value: m.id, label: m.name }))}
            value={moduleId}
            onChange={setModuleId}
          />
        )}

        <Label text="DATE LIMITE" />
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 6,
        }}>
          <TouchableOpacity onPress={() => shiftDate(-1)} style={{ padding: spacing.sm }}>
            <Text style={{ fontSize: fontSize.lg, color: colors.primary, fontWeight: "800" }}>‹</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, textTransform: "capitalize" }}>
            {dateLimite.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </Text>
          <TouchableOpacity onPress={() => shiftDate(1)} style={{ padding: spacing.sm }}>
            <Text style={{ fontSize: fontSize.lg, color: colors.primary, fontWeight: "800" }}>›</Text>
          </TouchableOpacity>
        </View>

        <Label text="BARÈME" />
        <TextInput
          value={pointsMax}
          onChangeText={setPointsMax}
          placeholder="20"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          maxLength={5}
          style={{ ...inputStyle, width: 110, textAlign: "center", fontWeight: "700" }}
        />
      </ScrollView>

      <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border }}>
        <TouchableOpacity onPress={handleSave} disabled={mutation.isPending} activeOpacity={0.85}>
          <View style={{
            backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15,
            alignItems: "center", opacity: mutation.isPending ? 0.7 : 1,
          }}>
            {mutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: fontSize.md }}>
                {editing ? "Enregistrer les modifications" : "Créer le devoir"}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
