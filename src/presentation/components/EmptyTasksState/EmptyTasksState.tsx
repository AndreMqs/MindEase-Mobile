import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import type { Theme } from '../../../shared/theme';

type EmptyTasksStateProps = {
  message?: string;
};

export function EmptyTasksState({ message = 'Nenhuma tarefa ainda.' }: EmptyTasksStateProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <Text style={styles.hint}>Toque no botão + para criar uma tarefa.</Text>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.xxl,
      alignItems: 'center',
    },
    text: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    hint: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  });
}
