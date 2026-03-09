import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenContainer, ScreenHeader, Input, Button, Checkbox } from '../../components';
import { useThemeOptional } from '../../../app/providers';
import { useServices } from '../../../app/providers';
import { getEmailError, getPasswordError } from '../../../shared/utils/validation';
import type { RootStackScreenProps } from '../../../app/navigation/types';
import { markPanelWelcomeForNextOpen } from '../../../app/panelWelcome';
import type { Theme } from '../../../shared/theme';

export function CadastroScreen({ navigation }: RootStackScreenProps<'Cadastro'>) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const { signUpUseCase } = useServices();

  const validate = (): boolean => {
    const nameErr = !name.trim() ? 'Nome é obrigatório.' : null;
    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);
    let confirmErr: string | null = null;
    if (!confirmPassword) confirmErr = 'Confirme a senha.';
    else if (password !== confirmPassword) confirmErr = 'As senhas não coincidem.';
    const termsErr = !acceptedTerms ? 'Aceite os termos de uso para continuar.' : null;

    setErrors({
      name: nameErr ?? undefined,
      email: emailErr ?? undefined,
      password: passwordErr ?? undefined,
      confirmPassword: confirmErr ?? undefined,
      terms: termsErr ?? undefined,
    });
    return !nameErr && !emailErr && !passwordErr && !confirmErr && !termsErr;
  };

  const handleCadastrar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await signUpUseCase.execute({
        email: email.trim(),
        password,
        name: name.trim(),
        displayName: name.trim(),
        acceptedTerms: true,
      });
      if (result.success) {
        markPanelWelcomeForNextOpen();
        navigation.replace('MainTabs');
      } else {
        const msg = result.error;
        if (msg.includes('email-already-in-use') || msg.toLowerCase().includes('already'))
          Alert.alert('Erro ao cadastrar', 'Este e-mail já está em uso.');
        else if (msg.includes('weak-password') || msg.includes('password'))
          Alert.alert('Erro ao cadastrar', 'Senha muito fraca. Use no mínimo 6 caracteres.');
        else
          Alert.alert('Erro ao cadastrar', result.error);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer withKeyboard>
      <ScreenHeader onBack={() => navigation.goBack()} title="Cadastro" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Input
            label="Nome"
            placeholder="Seu nome"
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
            error={errors.name}
            autoCapitalize="words"
          />
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />
          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setErrors((e) => ({ ...e, password: undefined, confirmPassword: undefined }));
            }}
            secureTextEntry
            error={errors.password}
          />
          <Input
            label="Confirmar senha"
            placeholder="Repita a senha"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              setErrors((e) => ({ ...e, confirmPassword: undefined }));
            }}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <Checkbox
            value={acceptedTerms}
            onValueChange={(v) => {
              setAcceptedTerms(v);
              setErrors((e) => ({ ...e, terms: undefined }));
            }}
            label="Aceito os termos de uso"
            error={errors.terms}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Cadastrar"
            onPress={handleCadastrar}
            loading={loading}
            disabled={!acceptedTerms}
            style={styles.primaryButton}
          />
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
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
      justifyContent: 'space-between',
    },
    form: {
      flex: 1,
      marginBottom: theme.spacing.lg,
    },
    actions: {
      paddingTop: theme.spacing.lg,
    },
    primaryButton: { width: '100%' },
  });
}
