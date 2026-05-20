import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TeacherMoreScreen from "@/screens/teacher/TeacherMoreScreen";
import DisciplineScreen from "@/screens/teacher/DisciplineScreen";
import QuizListScreen from "@/screens/teacher/QuizListScreen";
import QuizDetailScreen from "@/screens/teacher/QuizDetailScreen";
import MessagesTab from "@/screens/tabs/MessagesTab";
import NotificationsTab from "@/screens/tabs/NotificationsTab";
import ProfileScreen from "@/screens/ProfileScreen";
import { useTheme } from "@/context/ThemeContext";
import { fontSize } from "@/constants/theme";
import type { TeacherMoreStackParamList } from "@/types/teacher";

const Stack = createNativeStackNavigator<TeacherMoreStackParamList>();

/** "Plus" tab of the teacher navigator: discipline, quiz, messagerie, notifications, profil. */
export default function TeacherMoreStack() {
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
      <Stack.Screen name="MoreMenu" component={TeacherMoreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Discipline" component={DisciplineScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuizList" component={QuizListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuizDetail" component={QuizDetailScreen} options={{ title: "Quiz" }} />
      <Stack.Screen name="Messages" component={MessagesTab} options={{ title: "Messagerie" }} />
      <Stack.Screen name="Notifications" component={NotificationsTab} options={{ title: "Notifications" }} />
      <Stack.Screen name="Profil" component={ProfileScreen} options={{ title: "Mon profil" }} />
    </Stack.Navigator>
  );
}
