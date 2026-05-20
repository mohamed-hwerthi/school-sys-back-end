import { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { homeworkApi } from "@/api/homework.api";
import { teacherApi } from "@/api/teacher.api";
import { GradientHeader } from "@/components/GradientHeader";
import { ChipRow } from "@/components/ChipRow";
import { Badge } from "@/components/ui/Badge";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { TeacherDevoirsStackParamList } from "@/types/teacher";

type Nav = NativeStackNavigationProp<TeacherDevoirsStackParamList, "DevoirsList">;

function statutBadge(statut: string) {
  const s = (statut ?? "").toUpperCase();
  if (s === "PUBLIE") return { label: "Publié", color: colors.success, bg: colors.success + "15" };
  if (s.startsWith("CLOT") || s.startsWith("CLÔT") || s === "FERME" || s === "ARCHIVE") {
    return { label: "Clôturé", color: colors.textMuted, bg: colors.surfaceHover };
  }
  return { label: statut || "—", color: colors.info, bg: colors.info + "15" };
}

export default function DevoirsListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const [filterClass, setFilterClass] = useState("all");

  const devoirsQ = useQuery({ queryKey: ["homework", "devoirs"], queryFn: homeworkApi.getDevoirs });
  const classesQ = useQuery({ queryKey: ["teacher", "classes"], queryFn: teacherApi.getClasses });

  const classes = classesQ.data ?? [];
  const classeById = new Map(classes.map((c) => [c.id, c]));
  const devoirs = devoirsQ.data ?? [];

  const filtered = useMemo(
    () => (filterClass === "all" ? devoirs : devoirs.filter((d) => d.classeId === filterClass)),
    [devoirs, filterClass],
  );

  const chipItems = [
    { value: "all", label: "Toutes" },
    ...classes.map((c) => ({ value: c.id, label: c.fullName })),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <GradientHeader title="Devoirs" subtitle="Vos devoirs" />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <ChipRow items={chipItems} value={filterClass} onChange={setFilterClass} />
      </View>

      {devoirsQ.isLoading ? (
        <ListSkeleton count={6} avatar={false} />
      ) : devoirsQ.isError ? (
        <ErrorView message="Impossible de charger les devoirs" onRetry={() => devoirsQ.refetch()} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: spacing.lg }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => devoirsQ.refetch()}
          refreshing={devoirsQ.isFetching}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <EmptyState icon="📚" title="Aucun devoir" subtitle="Appuyez sur + pour en créer un." />
          }
          renderItem={({ item }) => {
            const b = statutBadge(item.statut);
            const cl = item.classeId ? classeById.get(item.classeId) : undefined;
            const meta = [
              cl ? `Classe ${cl.fullName}` : null,
              item.dateLimite ? `📅 ${item.dateLimite}` : null,
              `📥 ${item.totalSoumissions}`,
            ].filter(Boolean).join("   ·   ");
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("DevoirDetail", { devoirId: item.id })}
                style={{ backgroundColor: colors.background, borderRadius: 16, padding: spacing.md, ...shadows.soft }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 }} numberOfLines={1}>
                    {item.titre}
                  </Text>
                  <Badge label={b.label} color={b.color} bgColor={b.bg} />
                </View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 6 }}>{meta}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Floating create button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("DevoirForm", {})}
        style={{
          position: "absolute", right: spacing.lg, bottom: spacing.lg,
          width: 56, height: 56, borderRadius: 20, backgroundColor: colors.primary,
          justifyContent: "center", alignItems: "center", ...shadows.card,
        }}
      >
        <Text style={{ fontSize: 30, color: "#fff", fontWeight: "300", marginTop: -3 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
