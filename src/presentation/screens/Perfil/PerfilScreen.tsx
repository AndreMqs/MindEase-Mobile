import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { ScreenContainer } from '../../components';
import { ProfileHeader, ProfilePreferencesSection, ProfileActionList, type ProfileAction } from './components';
import { useThemeOptional, usePreferences } from '../../../app/providers';
import { useServices } from '../../../app/providers';
import type { PerfilStackScreenProps } from '../../../app/navigation/types';
import type { Theme } from '../../../shared/theme';

/**
 * Tela de perfil do usuário autenticado.
 * Dados vêm do auth (getCurrentUser).
 */
export function PerfilScreen({ navigation }: PerfilStackScreenProps<'Perfil'>) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { authRepository } = useServices();
  const { preferences } = usePreferences();
  const user = authRepository.getCurrentUser();

  const headerData = useMemo(
    () => ({
      displayName: user?.displayName ?? null,
      email: user?.email ?? null,
      photoURL: user?.photoURL ?? null,
    }),
    [user?.displayName, user?.email, user?.photoURL]
  );

  const actions: ProfileAction[] = useMemo(
    () => [
      {
        id: 'alterar-dados',
        title: 'Alterar dados',
        onPress: () => navigation.navigate('AlterarDados'),
      },
      {
        id: 'alterar-senha',
        title: 'Alterar senha',
        onPress: () => navigation.navigate('AlterarSenha'),
      },
      { id: 'termos', title: 'Termos de uso', onPress: () => {}, disabled: true },
      { id: 'privacidade', title: 'Privacidade', onPress: () => {}, disabled: true },
      {
        id: 'sair',
        title: 'Sair',
        variant: 'danger' as const,
        onPress: async () => {
          await authRepository.signOut();
          const root = navigation.getParent()?.getParent();
          if (root) {
            root.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
          }
        },
      },
    ],
    [authRepository, navigation]
  );

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader data={headerData} />
        <ProfilePreferencesSection preferences={preferences} />
        <ProfileActionList actions={actions} />
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    content: { paddingBottom: theme.spacing.xxl },
  });
}
