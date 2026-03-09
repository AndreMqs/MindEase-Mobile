import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation';
import { ServicesProvider, PreferencesProvider, ThemeProvider } from './providers';

export function App() {
  return (
    <SafeAreaProvider>
      <ServicesProvider>
        <PreferencesProvider>
          <ThemeProvider>
            <StatusBar barStyle="light-content" backgroundColor="transparent" />
            <RootNavigator />
          </ThemeProvider>
        </PreferencesProvider>
      </ServicesProvider>
    </SafeAreaProvider>
  );
}
