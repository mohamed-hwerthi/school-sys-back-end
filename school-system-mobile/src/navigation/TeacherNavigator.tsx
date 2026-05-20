import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TeacherHomeScreen from "@/screens/teacher/TeacherHomeScreen";
import TeacherTimetableScreen from "@/screens/teacher/TeacherTimetableScreen";
import TeacherClassesStack from "@/navigation/TeacherClassesStack";
import TeacherDevoirsStack from "@/navigation/TeacherDevoirsStack";
import TeacherMoreStack from "@/navigation/TeacherMoreStack";
import { tabIcon, useRoleTabScreenOptions } from "@/navigation/sharedTabs";

const Tab = createBottomTabNavigator();

/** Bottom-tab navigation for the ENSEIGNANT role. */
export default function TeacherNavigator() {
  const screenOptions = useRoleTabScreenOptions();
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Accueil" component={TeacherHomeScreen} options={{ tabBarIcon: tabIcon("home-outline") }} />
      <Tab.Screen name="Classes" component={TeacherClassesStack} options={{ tabBarIcon: tabIcon("school-outline") }} />
      <Tab.Screen name="EDT" component={TeacherTimetableScreen} options={{ tabBarIcon: tabIcon("calendar-outline") }} />
      <Tab.Screen name="Devoirs" component={TeacherDevoirsStack} options={{ tabBarIcon: tabIcon("book-outline") }} />
      <Tab.Screen name="Plus" component={TeacherMoreStack} options={{ tabBarIcon: tabIcon("grid-outline") }} />
    </Tab.Navigator>
  );
}
