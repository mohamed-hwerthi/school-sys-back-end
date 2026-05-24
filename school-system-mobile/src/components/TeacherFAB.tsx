import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, shadows } from "@/constants/theme";

/**
 * MOB-FUNC-021 — bouton flottant enseignant avec menu rapide :
 *  - Marquer une absence  (Mes classes → Présence)
 *  - Saisir une note      (Mes classes → Notes)
 *  - Créer un devoir      (Devoirs → Nouveau)
 *
 * À positionner en absolute en bas à droite de l'écran parent.
 */
export function TeacherFAB() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [open, setOpen] = useState(false);

  const actions = [
    {
      icon: "📋",
      label: "Marquer une présence",
      onPress: () => {
        setOpen(false);
        navigation.navigate("TeacherClassesTab");
      },
    },
    {
      icon: "📊",
      label: "Saisir une note",
      onPress: () => {
        setOpen(false);
        navigation.navigate("TeacherClassesTab");
      },
    },
    {
      icon: "📝",
      label: "Créer un devoir",
      onPress: () => {
        setOpen(false);
        navigation.navigate("TeacherDevoirsTab");
      },
    },
  ];

  return (
    <>
      {/* FAB principal */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          right: spacing.lg,
          bottom: spacing.lg,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          ...shadows.card,
        }}
      >
        <Text style={{ fontSize: 28, color: "#fff", fontWeight: "300", marginTop: -2 }}>+</Text>
      </TouchableOpacity>

      {/* Modal avec actions */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            paddingRight: spacing.lg,
            paddingBottom: spacing.lg + 70,
          }}
        >
          <View style={{ gap: spacing.sm, alignItems: "flex-end" }}>
            {actions.map((a) => (
              <Pressable
                key={a.label}
                onPress={a.onPress}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.surface,
                  borderRadius: 24,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  opacity: pressed ? 0.8 : 1,
                  ...shadows.card,
                })}
              >
                <Text style={{ fontSize: 18, marginRight: spacing.sm }}>{a.icon}</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
