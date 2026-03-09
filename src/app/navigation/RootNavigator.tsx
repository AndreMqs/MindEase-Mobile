import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { SplashScreen } from '../../presentation/screens/Splash/SplashScreen';
import { LoginScreen } from '../../presentation/screens/Login/LoginScreen';
import { CadastroScreen } from '../../presentation/screens/Cadastro';
import { RecuperarSenhaScreen } from '../../presentation/screens/RecuperarSenha';
import { MainTabsNavigator } from './MainTabsNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} />
        <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
