import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenContainer, ScreenHeader, Input, Button } from '../../components';
import { useThemeOptional } from '../../../app/providers';
import { useServices } from '../../../app/providers';
import { getPasswordError } from '../../../shared/utils/validation';
import type { PerfilStackScreenProps } from '../../../app/navigation/types';
import type { Theme } from '../../../shared/theme';

export function AlterarSenhaScreen({ navigation }: PerfilStackScreenProps<'AlterarSenha'>) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { authRepository } = useServices();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  const validate = (): boolean => {
    const currentErr = !currentPassword ? 'Informe a senha atual.' : null;
    const newErr = getPasswordError(newPassword);
    let confirmErr: string | null = null;
    if (!confirmPassword) confirmErr = 'Confirme a nova senha.';
    else if (newPassword !== confirmPassword) confirmErr = 'As senhas não coincidem.';
    setErrors({
      current: currentErr ?? undefined,
      new: newErr ?? undefined,
      confirm: confirmErr ?? undefined,
    });
    return !currentErr && !newErr && !confirmErr;
  };

  const handleAlterar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await authRepository.updatePassword(currentPassword, newPassword);
      Alert.alert('Sucesso', 'Senha alterada.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('wrong-password') || msg.includes('invalid-credential'))
        Alert.alert('Erro', 'Senha atual incorreta.');
      else if (msg.includes('requires-recent-login'))
        Alert.alert('Erro', 'Por segurança, faça login novamente.');
      else
        Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer withKeyboard>
      <ScreenHeader onBack={() => navigation.goBack()} title="Alterar senha" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Input
            label="Senha atual"
            placeholder="••••••••"
            value={currentPassword}
            onChangeText={(t) => { setCurrentPassword(t); setErrors((e) => ({ ...e, current: undefined })); }}
            secureTextEntry
            error={errors.current}
          />
          <Input
            label="Nova senha"
            placeholder="Mínimo 6 caracteres"
            value={newPassword}
            onChangeText={(t) => {
              setNewPassword(t);
              setErrors((e) => ({ ...e, new: undefined, confirm: undefined }));
            }}
            secureTextEntry
            error={errors.new}
          />
          <Input
            label="Confirmar nova senha"
            placeholder="Repita a nova senha"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              setErrors((e) => ({ ...e, confirm: undefined }));
            }}
            secureTextEntry
            error={errors.confirm}
          />
          <Button title="Alterar senha" onPress={handleAlterar} loading={loading} style={styles.button} />
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
