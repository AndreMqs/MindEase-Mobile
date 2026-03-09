import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { TarefasStackParamList } from './types';
import { TarefasScreen } from '../../presentation/screens/Tarefas';
import { TaskDetailScreen } from '../../presentation/screens/TaskDetail';
import { TaskEditScreen } from '../../presentation/screens/TaskEdit';

const Stack = createNativeStackNavigator<TarefasStackParamList>();

export function TarefasStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="TarefasList" component={TarefasScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="TaskEdit" component={TaskEditScreen} />
    </Stack.Navigator>
  );
}
