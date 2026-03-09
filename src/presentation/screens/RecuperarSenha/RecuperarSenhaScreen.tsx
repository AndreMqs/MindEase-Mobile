import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ScreenContainer, ScreenHeader, Input, Button } from '../../components';
import { useThemeOptional } from '../../../app/providers';
import { useServices } from '../../../app/providers';
import { getEmailError } from '../../../shared/utils/validation';
import type { RootStackScreenProps } from '../../../app/navigation/types';
import type { Theme } from '../../../shared/theme';

export function RecuperarSenhaScreen({ navigation }: RootStackScreenProps<'RecuperarSenha'>) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { sendPasswordResetUseCase } = useServices();

  const handleEnviar = async () => {
    const err = getEmailError(email);
    setEmailError(err);
    if (err) return;

    setLoading(true);
    try {
      const result = await sendPasswordResetUseCase.execute(email.trim());
      if (result.success) {
        Alert.alert(
          'E-mail enviado',
          'Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        if (result.error.includes('user-not-found') || result.error.toLowerCase().includes('user'))
          Alert.alert('Erro', 'Não há conta cadastrada com este e-mail.');
        else
          Alert.alert('Erro', result.error);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar o e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer withKeyboard>
      <ScreenHeader onBack={() => navigation.goBack()} title="Recuperar senha" />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Esqueceu a senha?</Text>
          <Text style={styles.subtitle}>
            Informe o e-mail da sua conta e enviaremos um link para redefinir sua senha.
          </Text>
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
          <Button
            title="Enviar instruções"
            onPress={handleEnviar}
            loading={loading}
            style={styles.primaryButton}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: {
      paddingTop: theme.spacing.xl,
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    form: {
      maxWidth: 400,
      alignSelf: 'stretch',
    },
    primaryButton: {
      width: '100%',
      marginTop: theme.spacing.md,
    },
  });
}
