import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useInfiniteQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { GradientHeader } from "@/components/GradientHeader";
import { SearchBar } from "@/components/SearchBar";
import { ChipRow } from "@/components/ChipRow";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { AdminSchoolStackParamList } from "@/navigation/AdminSchoolStack";

type Nav = NativeStackNavigationProp<AdminSchoolStackParamList, "SchoolOverview">;

const PAGE_SIZE = 30;

function teacherStatutBadge(statut: string | null) {
  if ((statut ?? "").toLowerCase() === "actif") {
    return { label: "Actif", color: colors.success, bg: colors.success + "15" };
  }
  return { label: statut || "—", color: colors.textMuted, bg: colors.surfaceHover };
}

export default function AdminSchoolScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState<string>("all");

  const teachersQ = useInfiniteQuery({
    queryKey: ["admin", "teachers-page", search.trim(), statut],
    queryFn: ({ pageParam }) =>
      adminApi.getTeachersPage({
        page: pageParam as number,
        size: PAGE_SIZE,
        search: search.trim() || undefined,
        statut: statut !== "all" ? statut : undefined,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.page + 1),
  });

  const teachers = teachersQ.data?.pages.flatMap((p) => p.content) ?? [];
  const total = teachersQ.data?.pages[0]?.totalElements ?? 0;

  const statutChips = [
    { value: "all", label: "Tous" },
    { value: "actif", label: "Actifs" },
    { value: "inactif", label: "Inactifs" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <GradientHeader
        title="Enseignants"
        subtitle={total > 0 ? `${total} au total` : "Corps enseignant de l'école"}
      />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Nom, email, spécialité..." />
      </View>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.sm }}>
        <ChipRow items={statutChips} value={statut} onChange={setStatut} />
      </View>

      {teachersQ.isLoading ? (
        <ListSkeleton count={8} />
      ) : teachersQ.isError ? (
        <ErrorView message="Impossible de charger les enseignants" onRetry={() => teachersQ.refetch()} />
      ) : (
        <FlatList
          data={teachers}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => teachersQ.refetch()}
          refreshing={teachersQ.isRefetching}
          onEndReached={() => {
            if (teachersQ.hasNextPage && !teachersQ.isFetchingNextPage) teachersQ.fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <EmptyState
              icon="👥"
              title={search ? "Aucun enseignant trouvé" : "Aucun enseignant"}
              subtitle={search ? "Essayez un autre mot-clé" : undefined}
            />
          }
          ListFooterComponent={
            teachersQ.isFetchingNextPage ? (
              <View style={{ paddingVertical: spacing.md, alignItems: "center" }}>
                <ActivityIndicator color={colors.primary} />
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 6 }}>
                  Chargement…
                </Text>
              </View>
            ) : !teachersQ.hasNextPage && teachers.length > 0 ? (
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, textAlign: "center", paddingVertical: spacing.md }}>
                {teachers.length} sur {total} affichés
              </Text>
            ) : null
          }
          renderItem={({ item }) => {
            const b = teacherStatutBadge(item.statut);
            const fullName = `${item.firstName} ${item.lastName}`;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("TeacherDetail", { teacherId: item.id, teacherName: fullName })}
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
                    {fullName}
                  </Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                    {item.specialization || item.email || "—"}
                  </Text>
                </View>
                <Badge label={b.label} color={b.color} bgColor={b.bg} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
