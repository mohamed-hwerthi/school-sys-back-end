import { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { schoolsApi } from "@/api/schools.api";
import { useSchool } from "@/context/SchoolContext";
import { EmptyState } from "@/components/EmptyState";
import { ErrorView } from "@/components/ErrorView";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, gradients, shadows } from "@/constants/theme";

/**
 * First screen of the app — the user picks their school before logging in.
 */
export default function SchoolPickerScreen() {
  const { colors } = useTheme();
  const { selectSchool } = useSchool();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const { data: schools = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["schools"],
    queryFn: schoolsApi.getSchools,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? schools.filter((s) => s.name.toLowerCase().includes(q)) : schools;
  }, [schools, search]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Hero */}
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 44,
          paddingBottom: 52,
          paddingHorizontal: spacing.lg,
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
          alignItems: "center",
        }}
      >
        <View style={{
          width: 78, height: 78, borderRadius: 26, backgroundColor: colors.background,
          justifyContent: "center", alignItems: "center", marginBottom: spacing.md,
          ...shadows.card,
        }}>
          <Text style={{ fontSize: 36, fontWeight: "900", color: colors.primary }}>E</Text>
        </View>
        <Text style={{ fontSize: 27, fontWeight: "800", color: "#fff", letterSpacing: 0.3 }}>EcoleNet</Text>
        <Text style={{ fontSize: fontSize.sm, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
          Choisissez votre école
        </Text>
      </LinearGradient>

      {/* Search — floats over the hero edge */}
      <View style={{
        flexDirection: "row", alignItems: "center",
        marginHorizontal: spacing.lg, marginTop: -26,
        backgroundColor: colors.background, borderRadius: 18,
        paddingHorizontal: spacing.md, height: 54,
        ...shadows.card,
      }}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher une école..."
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ flex: 1, fontSize: fontSize.md, color: colors.text }}
        />
      </View>

      {/* Body */}
      {isLoading ? (
        <ListSkeleton count={4} />
      ) : isError ? (
        <ErrorView message="Impossible de charger les écoles" onRetry={refetch} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(s) => s.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing.lg }}
          ListHeaderComponent={
            <Text style={{
              fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted,
              letterSpacing: 1.2, marginBottom: spacing.md,
            }}>
              {filtered.length} ÉCOLE{filtered.length > 1 ? "S" : ""} DISPONIBLE{filtered.length > 1 ? "S" : ""}
            </Text>
          }
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <EmptyState
              icon="🏫"
              title={search ? "Aucune école trouvée" : "Aucune école disponible"}
              subtitle={search ? "Essayez un autre nom" : undefined}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => selectSchool(item)}
              style={{
                flexDirection: "row", alignItems: "center",
                backgroundColor: colors.background, borderRadius: 20, padding: spacing.md,
                ...shadows.soft,
              }}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 52, height: 52, borderRadius: 16,
                  justifyContent: "center", alignItems: "center", marginRight: spacing.md,
                }}
              >
                <Text style={{ fontSize: 24 }}>🏫</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                  {item.slug}
                </Text>
              </View>
              <View style={{
                width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceHover,
                justifyContent: "center", alignItems: "center",
              }}>
                <Text style={{ fontSize: fontSize.md, color: colors.primary, fontWeight: "800" }}>›</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
