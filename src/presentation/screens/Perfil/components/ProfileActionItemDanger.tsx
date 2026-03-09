import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeOptional } from '../../../../app/providers';
import type { Theme } from '../../../../shared/theme';

type ProfileActionItemDangerProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.md,
      alignSelf: 'flex-start',
    },
    title: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.error,
    },
    titleDisabled: { opacity: 0.6 },
  });
}

export function ProfileActionItemDanger({ title, onPress, disabled = false }: ProfileActionItemDangerProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={styles.container}
    >
      <Text style={[styles.title, disabled && styles.titleDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
}
