import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface GradeDetailProps {
  grade: any;
  onBack: () => void;
}

export default function GradeDetailScreen({ grade, onBack }: GradeDetailProps) {
  const { colors } = useTheme();
  if (!grade) return null;

  const noteColor = (grade.note >= 14) ? colors.success : (grade.note >= 10) ? colors.warning : colors.error;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xl }}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: spacing.md, padding: 4 }}>
          <Text style={{ fontSize: 24, color: colors.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: fontSize.heading, fontWeight: "800", color: colors.text }}>Detail de la note</Text>
      </View>

      {/* Big score */}
      <View style={{
        backgroundColor: noteColor + "10", borderRadius: borderRadius.xl, padding: spacing.xl,
        alignItems: "center", marginBottom: spacing.xl, borderWidth: 2, borderColor: noteColor + "30",
      }}>
        <Text style={{ fontSize: 56, fontWeight: "900", color: noteColor }}>{grade.note}</Text>
        <Text style={{ fontSize: fontSize.lg, color: noteColor + "90", fontWeight: "600" }}>/ {grade.bareme || 20}</Text>
      </View>

      {/* Details grid */}
      <View style={{ backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border }}>
        {[
          { label: "Matiere", value: grade.moduleName || grade.matiere || "—" },
          { label: "Examen", value: grade.examenName || grade.titre || "—" },
          { label: "Coefficient", value: grade.coefficient || 1 },
          { label: "Enseignant", value: grade.teacherName || grade.enseignant || "—" },
          { label: "Classe", value: grade.classeName || grade.classe || "—" },
          { label: "Date", value: grade.date || grade.createdAt?.split("T")[0] || "—" },
        ].map((item, i) => (
          <View key={i} style={{
            flexDirection: "row", justifyContent: "space-between", paddingVertical: 12,
            borderBottomWidth: i < 5 ? 1 : 0, borderBottomColor: colors.border,
          }}>
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{item.label}</Text>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Remarque */}
      {grade.remarque && (
        <View style={{
          backgroundColor: colors.warning + "10", borderRadius: borderRadius.lg, padding: spacing.lg,
          marginTop: spacing.lg, borderWidth: 1, borderColor: colors.warning + "20",
        }}>
          <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.warning, marginBottom: spacing.xs }}>REMARQUE</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.text }}>{grade.remarque}</Text>
        </View>
      )}
    </ScrollView>
  );
}
