import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MainTabsParamList } from './types';
import { PainelScreen } from '../../presentation/screens/Painel';
import { TarefasStackNavigator } from './TarefasStackNavigator';
import { PerfilStackNavigator } from './PerfilStackNavigator';
import { LojaScreen } from '../../presentation/screens/Loja';
import { useThemeOptional } from '../providers';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TAB_BAR_HIDDEN_ROUTES = ['TaskDetail', 'TaskEdit'];

function getTarefasTabBarStyle(
  route: RouteProp<MainTabsParamList, 'Tarefas'>,
  defaultStyle: object
) {
  const routeName = getFocusedRouteNameFromRoute(route as Parameters<typeof getFocusedRouteNameFromRoute>[0]) ?? 'TarefasList';
  const hide = TAB_BAR_HIDDEN_ROUTES.includes(routeName);
  return hide ? { display: 'none' as const } : defaultStyle;
}

export function MainTabsNavigator() {
  const theme = useThemeOptional();
  const defaultTabBarStyle = {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  };
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: defaultTabBarStyle,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Painel"
        component={PainelScreen}
        options={{
          tabBarLabel: 'Painel',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons name={focused ? 'view-dashboard' : 'view-dashboard-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tarefas"
        component={TarefasStackNavigator}
        options={({ route }) => ({
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons name="format-list-checks" size={size} color={color} />
          ),
          tabBarStyle: getTarefasTabBarStyle(route, defaultTabBarStyle),
        })}
      />
      <Tab.Screen
        name="Loja"
        component={LojaScreen}
        options={{
          tabBarLabel: 'Loja',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilStackNavigator}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons name={focused ? 'account' : 'account-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
