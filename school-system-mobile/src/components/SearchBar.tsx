import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { spacing, fontSize, shadows } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Reusable search input with a magnifier icon and a clear button. */
export function SearchBar({ value, onChange, placeholder = "Rechercher..." }: SearchBarProps) {
  const { colors } = useTheme();
  return (
    <View style={{
      flexDirection: "row", alignItems: "center",
      backgroundColor: colors.background, borderRadius: 16,
      paddingHorizontal: spacing.md, height: 46, ...shadows.soft,
    }}>
      <Ionicons name="search-outline" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ flex: 1, marginLeft: spacing.sm, fontSize: fontSize.md, color: colors.text }}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}
