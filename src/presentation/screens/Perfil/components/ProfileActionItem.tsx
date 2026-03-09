import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeOptional } from '../../../../app/providers';
import type { Theme } from '../../../../shared/theme';

type ProfileActionItemProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: theme.spacing.sm,
    },
    disabled: { opacity: 0.6 },
    title: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.text,
    },
    titleDisabled: {
      color: theme.colors.textSecondary,
    },
    chevron: {
      fontSize: theme.fontSizes.xl,
      color: theme.colors.textSecondary,
      fontWeight: '300',
    },
  });
}

export function ProfileActionItem({ title, onPress, disabled = false }: ProfileActionItemProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.title, disabled && styles.titleDisabled]}>{title}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}
