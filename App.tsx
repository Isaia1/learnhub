import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProgressProvider } from './src/context/ProgressContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
