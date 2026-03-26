import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View, Text } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginScreen from "@/screens/LoginScreen";
import HomeTab from "@/screens/tabs/HomeTab";
import GradesTab from "@/screens/tabs/GradesTab";
import TimetableTab from "@/screens/tabs/TimetableTab";
import MessagesTab from "@/screens/tabs/MessagesTab";
import MoreTab from "@/screens/tabs/MoreTab";
import { colors } from "@/constants/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Accueil: "🏠",
    Notes: "📊",
    EDT: "🗓️",
    Messages: "💬",
    Plus: "⚙️",
  };
  return (
    <View style={{ alignItems: "center", paddingTop: 4 }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[label] || "📱"}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
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

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
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

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainTabs />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppContent />
          </NavigationContainer>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
