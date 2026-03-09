import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import type { Theme } from '../../../shared/theme';

export type PanelSelectOption<T extends string> = { value: T; label: string };

type PanelSelectProps<T extends string> = {
  label: string;
  value: T;
  options: PanelSelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { marginBottom: theme.spacing.md },
    label: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    disabled: { opacity: 0.6 },
    value: {
      flex: 1,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    chevron: {
      fontSize: theme.fontSizes.xl,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
  });
}

export function PanelSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: PanelSelectProps<T>) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const currentLabel = options.find((o) => o.value === value)?.label ?? value;

  const handlePress = () => {
    if (disabled) return;
    Alert.alert(
      label,
      'Escolha uma opção',
      [
        ...options.map((o) => ({
          text: o.label,
          onPress: () => onChange(o.value),
        })),
        { text: 'Cancelar', style: 'cancel' as const },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.disabled]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.value} numberOfLines={2}>{currentLabel}</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </View>
  );
}
