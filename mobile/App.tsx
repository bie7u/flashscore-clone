import React from 'react';
// Temporary simple version for demonstration
// To enable full app, uncomment the imports below and replace SimpleApp with the full navigation
import SimpleApp from './SimpleApp';

// Full app imports (uncomment for production):
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { ThemeProvider } from './src/utils/ThemeContext';
// import AppNavigator from './src/components/AppNavigator';

export default function App() {
  // Simple demo version (remove this for production)
  return <SimpleApp />;

  // Full app version (uncomment for production):
  // return (
  //   <SafeAreaProvider>
  //     <ThemeProvider>
  //       <AppNavigator />
  //       <StatusBar style="auto" />
  //     </ThemeProvider>
  //   </SafeAreaProvider>
  // );
}
