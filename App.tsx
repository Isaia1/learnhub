import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CoursesProvider } from './src/context/CoursesContext';
import { ProgressProvider } from './src/context/ProgressContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CoursesProvider>
          <ProgressProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </ProgressProvider>
        </CoursesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
