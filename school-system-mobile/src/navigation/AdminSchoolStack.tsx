import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminSchoolScreen from "@/screens/admin/AdminSchoolScreen";
import AdminTeacherDetailScreen from "@/screens/admin/AdminTeacherDetailScreen";
import { useTheme } from "@/context/ThemeContext";
import { fontSize } from "@/constants/theme";

export type AdminSchoolStackParamList = {
  SchoolOverview: undefined;
  TeacherDetail: { teacherId: string; teacherName: string };
};

const Stack = createNativeStackNavigator<AdminSchoolStackParamList>();

/** Admin "École" tab: overview (classes + teachers) → teacher detail. */
export default function AdminSchoolStack() {
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
      <Stack.Screen name="SchoolOverview" component={AdminSchoolScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="TeacherDetail"
        component={AdminTeacherDetailScreen}
        options={({ route }) => ({ title: route.params.teacherName })}
      />
    </Stack.Navigator>
  );
}
