import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminHomeScreen from "@/screens/admin/AdminHomeScreen";
import AdminSchoolStack from "@/navigation/AdminSchoolStack";
import AdminStudentsStack from "@/navigation/AdminStudentsStack";
import AdminFinanceScreen from "@/screens/admin/AdminFinanceScreen";
import AdminMoreStack from "@/navigation/AdminMoreStack";
import { tabIcon, useRoleTabScreenOptions } from "@/navigation/sharedTabs";

const Tab = createBottomTabNavigator();

/** Bottom-tab navigation for the ADMIN and DIRECTEUR roles (school administration). */
export default function AdminNavigator() {
  const screenOptions = useRoleTabScreenOptions();
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Accueil" component={AdminHomeScreen} options={{ tabBarIcon: tabIcon("stats-chart-outline") }} />
      <Tab.Screen name="Élèves" component={AdminStudentsStack} options={{ tabBarIcon: tabIcon("people-outline") }} />
      <Tab.Screen name="École" component={AdminSchoolStack} options={{ tabBarIcon: tabIcon("school-outline") }} />
      <Tab.Screen name="Finance" component={AdminFinanceScreen} options={{ tabBarIcon: tabIcon("wallet-outline") }} />
      <Tab.Screen name="Plus" component={AdminMoreStack} options={{ tabBarIcon: tabIcon("grid-outline") }} />
    </Tab.Navigator>
  );
}
