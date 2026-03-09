import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PerfilStackParamList } from './types';
import { PerfilScreen } from '../../presentation/screens/Perfil';
import { AlterarDadosScreen } from '../../presentation/screens/AlterarDados';
import { AlterarSenhaScreen } from '../../presentation/screens/AlterarSenha';

const Stack = createNativeStackNavigator<PerfilStackParamList>();

export function PerfilStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="AlterarDados" component={AlterarDadosScreen} />
      <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
    </Stack.Navigator>
  );
}
