import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TeacherClassesScreen from "@/screens/teacher/TeacherClassesScreen";
import ClassStudentsScreen from "@/screens/teacher/ClassStudentsScreen";
import AttendanceScreen from "@/screens/teacher/AttendanceScreen";
import ExamSelectScreen from "@/screens/teacher/ExamSelectScreen";
import GradeEntryScreen from "@/screens/teacher/GradeEntryScreen";
import NotifyParentScreen from "@/screens/teacher/NotifyParentScreen";
import { useTheme } from "@/context/ThemeContext";
import { fontSize } from "@/constants/theme";
import type { TeacherClassesStackParamList } from "@/types/teacher";

const Stack = createNativeStackNavigator<TeacherClassesStackParamList>();

/** "Classes" tab of the teacher navigator: class list → students of a class. */
export default function TeacherClassesStack() {
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
      <Stack.Screen
        name="ClassesList"
        component={TeacherClassesScreen}
        options={{ title: "Mes classes" }}
      />
      <Stack.Screen
        name="ClassStudents"
        component={ClassStudentsScreen}
        options={({ route }) => ({ title: `Classe ${route.params.fullName}`, animation: "slide_from_right" })}
      />
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={({ route }) => ({ title: `Appel — ${route.params.fullName}`, animation: "slide_from_right" })}
      />
      <Stack.Screen
        name="ExamSelect"
        component={ExamSelectScreen}
        options={({ route }) => ({ title: `Notes — ${route.params.fullName}`, animation: "slide_from_right" })}
      />
      <Stack.Screen
        name="GradeEntry"
        component={GradeEntryScreen}
        options={({ route }) => ({ title: route.params.examenName, animation: "slide_from_right" })}
      />
      <Stack.Screen
        name="NotifyParent"
        component={NotifyParentScreen}
        options={{ title: "Contacter les parents", animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
