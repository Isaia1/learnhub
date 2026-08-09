import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { TabBarScrollProvider } from '../context/TabBarScrollContext';
import AnimatedTabBar from '../components/AnimatedTabBar';
import { RootStackParamList, TabParamList, AuthStackParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import LessonScreen from '../screens/LessonScreen';
import QuizScreen from '../screens/QuizScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import LoadingScreen from '../components/LoadingScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function MainTabs() {
  return (
    <TabBarScrollProvider>
      <Tab.Navigator
        tabBar={(props) => <AnimatedTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Courses" component={CoursesScreen} options={{ title: 'Courses' }} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </TabBarScrollProvider>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Course' }} />
      <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: 'Lesson' }} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
      <Stack.Screen name="Flashcards" component={FlashcardsScreen} options={{ title: 'Flashcards' }} />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  const showMainApp = Boolean(user);

  return (
    <NavigationContainer>
      {showMainApp ? <MainStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
