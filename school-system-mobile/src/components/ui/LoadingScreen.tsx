import { View, Text, ActivityIndicator } from "react-native";
import { colors, fontSize } from "@/constants/theme";

export function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900" }}>E</Text>
      </View>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: 12 }}>Chargement...</Text>
    </View>
  );
}
