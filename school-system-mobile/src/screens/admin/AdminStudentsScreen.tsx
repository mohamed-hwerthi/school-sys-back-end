import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { adminApi, type StudentRecord } from "@/api/admin.api";
import { teacherApi } from "@/api/teacher.api";
import { GradientHeader } from "@/components/GradientHeader";
import { SearchBar } from "@/components/SearchBar";
import { ChipRow } from "@/components/ChipRow";
import { Badge } from "@/components/ui/Badge";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, shadows } from "@/constants/theme";
import type { AdminStudentsStackParamList } from "@/navigation/AdminStudentsStack";

type Nav = NativeStackNavigationProp<AdminStudentsStackParamList, "StudentsList">;

const PAGE_SIZE = 30;

function statusBadge(s: StudentRecord) {
  if (s.isBlocked) return { label: "Bloqué", color: colors.error, bg: colors.error + "15" };
  if (s.status?.toLowerCase() === "actif") return { label: "Actif", color: colors.success, bg: colors.success + "15" };
  return { label: s.status || "—", color: colors.warning, bg: colors.warning + "15" };
}

export default function AdminStudentsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState("");
  const [classeFilter, setClasseFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const classesQ = useQuery({ queryKey: ["admin", "classes"], queryFn: teacherApi.getClasses });
  const classes = classesQ.data ?? [];

  const studentsQ = useInfiniteQuery({
    queryKey: ["admin", "students", search.trim(), classeFilter, statusFilter],
    queryFn: ({ pageParam }) =>
      adminApi.getStudents({
        page: pageParam as number,
        size: PAGE_SIZE,
        search: search.trim() || undefined,
        classe: classeFilter !== "all" ? classeFilter : undefined,
        status: statusFilter === "actif" || statusFilter === "inactif" ? statusFilter : undefined,
        blocked: statusFilter === "blocked" ? true : undefined,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.page + 1),
  });

  const students = studentsQ.data?.pages.flatMap((p) => p.content) ?? [];
  const total = studentsQ.data?.pages[0]?.totalElements ?? 0;

  const classeChips = [
    { value: "all", label: "Toutes" },
    ...classes.map((c) => ({ value: c.fullName, label: c.fullName })),
  ];
  const statusChips = [
    { value: "all", label: "Tous" },
    { value: "actif", label: "Actifs" },
    { value: "inactif", label: "Inactifs" },
    { value: "blocked", label: "Bloqués" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <GradientHeader title="Élèves" subtitle={total > 0 ? `${total} élève${total > 1 ? "s" : ""}` : "Tous les élèves"} />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Nom, prénom, matricule..." />
      </View>

      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xs }}>
        <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, marginBottom: 6, letterSpacing: 0.5 }}>
          CLASSE
        </Text>
        <ChipRow items={classeChips} value={classeFilter} onChange={setClasseFilter} />
      </View>

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.sm }}>
        <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.textMuted, marginBottom: 6, letterSpacing: 0.5 }}>
          STATUT
        </Text>
        <ChipRow items={statusChips} value={statusFilter} onChange={setStatusFilter} />
      </View>

      {studentsQ.isLoading ? (
        <ListSkeleton count={8} />
      ) : studentsQ.isError ? (
        <ErrorView message="Impossible de charger les élèves" onRetry={() => studentsQ.refetch()} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(s) => s.id}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => studentsQ.refetch()}
          refreshing={studentsQ.isRefetching}
          onEndReached={() => {
            if (studentsQ.hasNextPage && !studentsQ.isFetchingNextPage) studentsQ.fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <EmptyState
              icon="🎓"
              title={search ? "Aucun élève trouvé" : "Aucun élève"}
              subtitle={search ? "Essayez un autre nom" : undefined}
            />
          }
          ListFooterComponent={
            studentsQ.isFetchingNextPage ? (
              <View style={{ paddingVertical: spacing.md, alignItems: "center" }}>
                <ActivityIndicator color={colors.primary} />
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 6 }}>
                  Chargement de plus d'élèves…
                </Text>
              </View>
            ) : !studentsQ.hasNextPage && students.length > 0 ? (
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, textAlign: "center", paddingVertical: spacing.md }}>
                {students.length} sur {total} affichés
              </Text>
            ) : null
          }
          renderItem={({ item }) => {
            const b = statusBadge(item);
            const fullName = `${item.firstName} ${item.lastName}`;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("StudentDetail", { studentId: item.id, studentName: fullName })}
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
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>{fullName}</Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>
                    {[item.niveau, item.classe ? `Classe ${item.classe}` : null, item.matricule || item.registrationNumber]
                      .filter(Boolean).join("  ·  ")}
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
