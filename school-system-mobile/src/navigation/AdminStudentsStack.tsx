import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminStudentsScreen from "@/screens/admin/AdminStudentsScreen";
import AdminStudentDetailScreen from "@/screens/admin/AdminStudentDetailScreen";
import { useTheme } from "@/context/ThemeContext";
import { fontSize } from "@/constants/theme";

export type AdminStudentsStackParamList = {
  StudentsList: undefined;
  StudentDetail: { studentId: string; studentName: string };
};

const Stack = createNativeStackNavigator<AdminStudentsStackParamList>();

/** Admin "Élèves" tab: searchable list → student 360° detail. */
export default function AdminStudentsStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: "700", fontSize: fontSize.lg },
        headerShadowVisible: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="StudentsList" component={AdminStudentsScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="StudentDetail"
        component={AdminStudentDetailScreen}
        options={({ route }) => ({ title: route.params.studentName })}
      />
    </Stack.Navigator>
  );
}
