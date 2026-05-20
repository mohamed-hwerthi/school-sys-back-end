import { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSchoolYear } from "@/context/SchoolYearContext";
import { useTheme } from "@/context/ThemeContext";
import { AVAILABLE_SCHOOL_YEARS } from "@/constants/schoolYear";
import { spacing, fontSize, borderRadius, shadows } from "@/constants/theme";

/** Pill that opens a modal to pick the current school year. */
export function YearPicker() {
  const { year, setYear } = useSchoolYear();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
        style={{
          flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
          backgroundColor: colors.background, borderRadius: borderRadius.full,
          paddingHorizontal: 14, paddingVertical: 8, ...shadows.soft,
        }}
      >
        <Ionicons name="calendar-outline" size={14} color={colors.primary} />
        <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.text, marginHorizontal: 8 }}>
          {year}
        </Text>
        <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ backgroundColor: colors.background, borderRadius: 18, padding: spacing.sm, minWidth: 220 }}>
            <Text style={{ fontSize: fontSize.xs, fontWeight: "800", color: colors.textMuted, letterSpacing: 1, padding: spacing.sm }}>
              ANNÉE SCOLAIRE
            </Text>
            {AVAILABLE_SCHOOL_YEARS.map((y) => {
              const active = y === year;
              return (
                <TouchableOpacity
                  key={y}
                  activeOpacity={0.7}
                  onPress={() => { setYear(y); setOpen(false); }}
                  style={{
                    paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12,
                    backgroundColor: active ? colors.primary + "12" : "transparent",
                  }}
                >
                  <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: active ? colors.primary : colors.text }}>
                    {y}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
