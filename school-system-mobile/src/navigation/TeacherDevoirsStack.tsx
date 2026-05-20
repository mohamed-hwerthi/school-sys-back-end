import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DevoirsListScreen from "@/screens/teacher/DevoirsListScreen";
import DevoirFormScreen from "@/screens/teacher/DevoirFormScreen";
import DevoirDetailScreen from "@/screens/teacher/DevoirDetailScreen";
import SubmissionCorrectionScreen from "@/screens/teacher/SubmissionCorrectionScreen";
import { useTheme } from "@/context/ThemeContext";
import { fontSize } from "@/constants/theme";
import type { TeacherDevoirsStackParamList } from "@/types/teacher";

const Stack = createNativeStackNavigator<TeacherDevoirsStackParamList>();

/** "Devoirs" tab of the teacher navigator: list → create/edit, detail → correction. */
export default function TeacherDevoirsStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: "700", fontSize: fontSize.lg },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="DevoirsList" component={DevoirsListScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="DevoirForm"
        component={DevoirFormScreen}
        options={({ route }) => ({
          title: route.params?.devoirId ? "Modifier le devoir" : "Nouveau devoir",
          animation: "slide_from_right",
        })}
      />
      <Stack.Screen
        name="DevoirDetail"
        component={DevoirDetailScreen}
        options={{ title: "Devoir", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SubmissionCorrection"
        component={SubmissionCorrectionScreen}
        options={{ title: "Correction", animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
