import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { storage } from "@/utils/storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, Text } from "react-native";
import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ChildProvider } from "@/context/ChildContext";
import { SchoolProvider, useSchool } from "@/context/SchoolContext";
import { SchoolYearProvider } from "@/context/SchoolYearContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import SchoolPickerScreen from "@/screens/SchoolPickerScreen";
import LoginScreen from "@/screens/LoginScreen";
import RoleUnsupportedScreen from "@/screens/RoleUnsupportedScreen";
import TeacherNavigator from "@/navigation/TeacherNavigator";
import AdminNavigator from "@/navigation/AdminNavigator";
import HomeTab from "@/screens/tabs/HomeTab";
import GradesTab from "@/screens/tabs/GradesTab";
import TimetableTab from "@/screens/tabs/TimetableTab";
import MessagesTab from "@/screens/tabs/MessagesTab";
import MoreTab from "@/screens/tabs/MoreTab";
import NotificationsTab from "@/screens/tabs/NotificationsTab";
import PaymentHistoryScreen from "@/screens/PaymentHistoryScreen";
import AnnouncementDetailScreen from "@/screens/AnnouncementDetailScreen";
import AbsencesScreen from "@/screens/AbsencesScreen";
import DisciplineScreen from "@/screens/DisciplineScreen";
import HomeworkScreen from "@/screens/HomeworkScreen";
import HomeworkDetailScreen from "@/screens/HomeworkDetailScreen";
import ResourcesScreen from "@/screens/ResourcesScreen";
import QuizListScreen from "@/screens/QuizListScreen";
import QuizDetailScreen from "@/screens/QuizDetailScreen";
import QuizPassationScreen from "@/screens/QuizPassationScreen";
import CantineScreen from "@/screens/CantineScreen";
import TransportScreen from "@/screens/TransportScreen";
import BulletinScreen from "@/screens/BulletinScreen";
import ChildProgressScreen from "@/screens/ChildProgressScreen";
import ChildCalendarScreen from "@/screens/ChildCalendarScreen";
import ChildProfileScreen from "@/screens/ChildProfileScreen";
import { colors } from "@/constants/theme";
import type { RootStackParamList } from "@/types/navigation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, gcTime: 1000 * 60 * 60 * 24 * 7 /* 7 days */ },
  },
});

/** Persists the React Query cache so the app shows last-known data offline. */
const persister = createAsyncStoragePersister({
  storage: {
    getItem: (k: string) => storage.getItem(k),
    setItem: (k: string, v: string) => storage.setItem(k, v),
    removeItem: (k: string) => storage.deleteItem(k),
  },
  key: "ECOLENET_QUERY_CACHE",
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabIcon({ routeName, color }: { routeName: string; color: string }) {
  const icons: Record<string, ComponentProps<typeof Ionicons>["name"]> = {
    Accueil: "home-outline",
    Notes: "bar-chart-outline",
    EDT: "calendar-outline",
    Messages: "chatbubble-outline",
    Plus: "grid-outline",
  };
  return <Ionicons name={icons[routeName] ?? "ellipse-outline"} size={23} color={color} />;
}

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => <TabIcon routeName={route.name} color={color} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: -2 },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          paddingBottom: 4,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Accueil" component={HomeTab} />
      <Tab.Screen name="Notes" component={GradesTab} />
      <Tab.Screen name="EDT" component={TimetableTab} />
      <Tab.Screen name="Messages" component={MessagesTab} />
      <Tab.Screen name="Plus" component={MoreTab} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen
        name="Notifications"
        component={NotificationsTab}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="Absences"
        component={AbsencesScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Discipline"
        component={DisciplineScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Homework"
        component={HomeworkScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="HomeworkDetail"
        component={HomeworkDetailScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="QuizList"
        component={QuizListScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="QuizDetail"
        component={QuizDetailScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="QuizPassation"
        component={QuizPassationScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Cantine"
        component={CantineScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Transport"
        component={TransportScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Bulletin"
        component={BulletinScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="ChildProgress"
        component={ChildProgressScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="ChildCalendar"
        component={ChildCalendarScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="ChildProfile"
        component={ChildProfileScreen}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { school, isLoading: schoolLoading } = useSchool();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  if (schoolLoading || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <View style={{
          width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primary,
          justifyContent: "center", alignItems: "center", marginBottom: 16,
        }}>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900" }}>E</Text>
        </View>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Step 1 — pick a school, Step 2 — log in, Step 3 — use the app.
  if (!school) {
    return <SchoolPickerScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Step 3 — route to the navigator matching the authenticated user's role.
  switch (user?.role) {
    case "PARENT":
      return (
        <ChildProvider>
          <MainStack />
        </ChildProvider>
      );
    case "ENSEIGNANT":
      return <TeacherNavigator />;
    case "ADMIN":
    case "DIRECTEUR":
      return <AdminNavigator />;
    default:
      // COMPTABLE, SUPER_ADMIN — no mobile experience.
      return <RoleUnsupportedScreen />;
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 1000 * 60 * 60 * 24 * 7 /* 7 days */,
          // Bump when query schemas change — invalidates any stale persisted cache.
          buster: "ecolenet-v2",
        }}
      >
        <ThemeProvider>
          <SchoolProvider>
            <AuthProvider>
              <SchoolYearProvider>
                <NavigationContainer>
                  <StatusBar style="auto" />
                  <AppContent />
                </NavigationContainer>
              </SchoolYearProvider>
            </AuthProvider>
          </SchoolProvider>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
