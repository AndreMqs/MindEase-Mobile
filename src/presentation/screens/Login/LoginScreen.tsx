import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer, LogoHeader, Input, Button } from '../../components';
import { useThemeOptional } from '../../../app/providers';
import { useServices } from '../../../app/providers';
import { getEmailError, getPasswordError } from '../../../shared/utils/validation';
import type { RootStackScreenProps } from '../../../app/navigation/types';
import { markPanelWelcomeForNextOpen } from '../../../app/panelWelcome';
import type { Theme } from '../../../shared/theme';

export function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { loginUseCase } = useServices();

  const handleEntrar = async () => {
    const eErr = getEmailError(email);
    const pErr = getPasswordError(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    try {
      const result = await loginUseCase.execute({ email: email.trim(), password });
      if (result.success) {
        markPanelWelcomeForNextOpen();
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Erro ao entrar', result.error);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer withKeyboard>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LogoHeader />
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Use seu e-mail e senha para acessar</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={(t) => { setEmail(t); setEmailError(null); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError ?? undefined}
          />
          <Input
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={(t) => { setPassword(t); setPasswordError(null); }}
            secureTextEntry
            error={passwordError ?? undefined}
          />

          <TouchableOpacity
            style={styles.forgotLink}
            onPress={() => navigation.navigate('RecuperarSenha')}
            disabled={loading}
          >
            <Text style={styles.forgotLinkText}>Esqueci a senha</Text>
          </TouchableOpacity>

          <Button
            title="Entrar"
            onPress={handleEntrar}
            loading={loading}
            style={styles.primaryButton}
          />
        </View>

        <View style={styles.actions}>
          <View style={styles.signUpRow}>
            <Text style={styles.signUpLabel}>Não tem conta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cadastro')}
              disabled={loading}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.signUpLink}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: 0,
      justifyContent: 'space-between',
    },
    header: {
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginTop: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    form: {
      marginBottom: theme.spacing.xl,
    },
    forgotLink: {
      alignSelf: 'flex-end',
      paddingVertical: theme.spacing.sm,
      marginTop: -theme.spacing.xs,
    },
    forgotLinkText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.medium,
    },
    primaryButton: {
      width: '100%',
      marginTop: theme.spacing.md,
    },
    actions: {
      paddingTop: theme.spacing.lg,
    },
    signUpRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signUpLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    signUpLink: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.semibold,
    },
  });
}
