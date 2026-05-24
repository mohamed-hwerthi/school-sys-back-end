import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminMoreScreen from "@/screens/admin/AdminMoreScreen";
import AdminStatsScreen from "@/screens/admin/AdminStatsScreen";
import ClassStatsDetailScreen from "@/screens/ClassStatsDetailScreen";
import DisciplineScreen from "@/screens/teacher/DisciplineScreen";
import IncidentDetailScreen from "@/screens/admin/IncidentDetailScreen";
import AdminInscriptionsScreen from "@/screens/admin/AdminInscriptionsScreen";
import AdminSchoolYearsScreen from "@/screens/admin/AdminSchoolYearsScreen";
import AdminAuditScreen from "@/screens/admin/AdminAuditScreen";
import AdminSessionsScreen from "@/screens/admin/AdminSessionsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { useTheme } from "@/context/ThemeContext";
import { fontSize } from "@/constants/theme";

export type AdminMoreStackParamList = {
  MoreMenu: undefined;
  Stats: undefined;
  ClassStatsDetail: { classeId: string; classeName: string };
  Discipline: undefined;
  IncidentDetail: { incidentId: string };
  Inscriptions: undefined;
  SchoolYears: undefined;
  Audit: undefined;
  Sessions: undefined;
  Profil: undefined;
};

const Stack = createNativeStackNavigator<AdminMoreStackParamList>();

/** Admin "Plus" tab: menu → discipline · audit · sessions · profil. */
export default function AdminMoreStack() {
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
      <Stack.Screen name="MoreMenu" component={AdminMoreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Stats" component={AdminStatsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ClassStatsDetail" component={ClassStatsDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Discipline" component={DisciplineScreen} options={{ headerShown: false }} />
      <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ title: "Incident" }} />
      <Stack.Screen name="Inscriptions" component={AdminInscriptionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SchoolYears" component={AdminSchoolYearsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Audit" component={AdminAuditScreen} options={{ title: "Journal d'audit" }} />
      <Stack.Screen name="Sessions" component={AdminSessionsScreen} options={{ title: "Sessions actives" }} />
      <Stack.Screen name="Profil" component={ProfileScreen} options={{ title: "Mon profil" }} />
    </Stack.Navigator>
  );
}
