import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { teacherApi } from "@/api/teacher.api";
import { Badge } from "@/components/ui/Badge";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { TeacherClassesStackParamList, TeacherStudent } from "@/types/teacher";

type ClassStudentsRoute = RouteProp<TeacherClassesStackParamList, "ClassStudents">;
type ClassStudentsNav = NativeStackNavigationProp<TeacherClassesStackParamList, "ClassStudents">;

function statusBadge(s: TeacherStudent) {
  if (s.isBlocked) return { label: "Bloqué", color: colors.error, bg: colors.error + "15" };
  if (s.status?.toLowerCase() === "actif") return { label: "Actif", color: colors.success, bg: colors.success + "15" };
  return { label: s.status || "—", color: colors.warning, bg: colors.warning + "15" };
}

function ActionCard({ icon, label, tint, onPress }: { icon: string; label: string; tint: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        flex: 1, flexDirection: "row", alignItems: "center",
        backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft,
      }}
    >
      <View style={{
        width: 36, height: 36, borderRadius: 12, backgroundColor: tint + "18",
        justifyContent: "center", alignItems: "center", marginRight: 10,
      }}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text, flex: 1 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ClassStudentsScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<ClassStudentsRoute>();
  const navigation = useNavigation<ClassStudentsNav>();
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["teacher", "students", params.niveauName, params.letter],
    queryFn: () => teacherApi.getStudents(params.niveauName, params.letter),
  });

  if (isLoading) return <ListSkeleton count={8} />;
  if (isError) return <ErrorView onRetry={refetch} />;

  const students = data?.content ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
      <FlatList
        data={students}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: spacing.lg }}
        onRefresh={refetch}
        refreshing={isFetching}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: spacing.md }}>
              <ActionCard icon="✓" label="Faire l'appel" tint={colors.primary}
                onPress={() => navigation.navigate("Attendance", params)} />
              <ActionCard icon="📝" label="Saisir les notes" tint={colors.info}
                onPress={() => navigation.navigate("ExamSelect", params)} />
            </View>
            <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1 }}>
              {students.length} ÉLÈVE{students.length > 1 ? "S" : ""}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <EmptyState icon="👥" title="Aucun élève" subtitle="Cette classe n'a aucun élève inscrit." />
        }
        renderItem={({ item }) => {
          const b = statusBadge(item);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("NotifyParent", {
                  studentId: item.id,
                  studentName: `${item.firstName} ${item.lastName}`,
                })
              }
              style={{
                flexDirection: "row", alignItems: "center",
                backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft,
              }}
            >
              <View style={{
                width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + "12",
                justifyContent: "center", alignItems: "center", marginRight: spacing.md,
              }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "800", color: colors.primary }}>
                  {item.firstName?.[0]}{item.lastName?.[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                  {item.matricule || item.registrationNumber || "—"}
                </Text>
              </View>
              <Badge label={b.label} color={b.color} bgColor={b.bg} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
