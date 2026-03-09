import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenContainer, ScreenHeader, Input, Button } from '../../components';
import { useThemeOptional } from '../../../app/providers';
import { useServices } from '../../../app/providers';
import { getEmailError } from '../../../shared/utils/validation';
import type { PerfilStackScreenProps } from '../../../app/navigation/types';
import type { Theme } from '../../../shared/theme';

export function AlterarDadosScreen({ navigation }: PerfilStackScreenProps<'AlterarDados'>) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { authRepository } = useServices();
  const user = authRepository.getCurrentUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (user) {
      setName(user.displayName ?? '');
      setEmail(user.email ?? '');
    }
  }, [user]);

  const handleSalvar = async () => {
    const nameErr = !name.trim() ? 'Nome é obrigatório.' : null;
    const emailErr = getEmailError(email);
    setErrors({ name: nameErr ?? undefined, email: emailErr ?? undefined });
    if (nameErr || emailErr) return;

    setLoading(true);
    try {
      if (name.trim() !== (user?.displayName ?? '')) {
        await authRepository.updateProfile(name.trim());
      }
      if (email.trim() !== (user?.email ?? '')) {
        await authRepository.updateEmail(email.trim());
      }
      Alert.alert('Sucesso', 'Dados atualizados.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('requires-recent-login') || msg.includes('recent'))
        Alert.alert('Erro', 'Por segurança, faça login novamente antes de alterar o e-mail.');
      else
        Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer withKeyboard>
      <ScreenHeader onBack={() => navigation.goBack()} title="Alterar dados" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
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
          <Button title="Salvar" onPress={handleSalvar} loading={loading} style={styles.button} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    content: { paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xxl },
    form: { paddingHorizontal: 0 },
    button: { width: '100%', marginTop: theme.spacing.md },
  });
}
