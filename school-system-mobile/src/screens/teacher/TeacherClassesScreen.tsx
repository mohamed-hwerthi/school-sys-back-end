import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { teacherApi } from "@/api/teacher.api";
import { ListSkeleton } from "@/components/skeletons/ListSkeleton";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/context/ThemeContext";
import { colors, spacing, fontSize, gradients, shadows } from "@/constants/theme";
import type { TeacherClassesStackParamList } from "@/types/teacher";

type Nav = NativeStackNavigationProp<TeacherClassesStackParamList, "ClassesList">;

export default function TeacherClassesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: classes = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["teacher", "classes"],
    queryFn: teacherApi.getClasses,
  });

  if (isLoading) return <ListSkeleton count={6} />;
  if (isError) return <ErrorView onRetry={refetch} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right", "bottom"]}>
      <FlatList
        data={classes}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: spacing.lg }}
        onRefresh={refetch}
        refreshing={isFetching}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <EmptyState icon="🏫" title="Aucune classe" subtitle="Vous n'êtes affecté à aucune classe." />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("ClassStudents", {
                classeId: item.id,
                niveauName: item.niveauName,
                letter: item.letter,
                fullName: item.fullName,
              })
            }
            style={{
              flexDirection: "row", alignItems: "center",
              backgroundColor: colors.background, borderRadius: 20, padding: spacing.md, ...shadows.soft,
            }}
          >
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: spacing.md }}
            >
              <Text style={{ fontSize: fontSize.md, fontWeight: "900", color: "#fff" }}>{item.fullName}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.text }}>
                Classe {item.fullName}
              </Text>
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>{item.niveauName}</Text>
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
    </SafeAreaView>
  );
}
