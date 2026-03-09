import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import type { Theme } from '../../../shared/theme';

type CheckboxProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowFlex: {
      flex: 1,
      minWidth: 0,
    },
    box: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxChecked: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    check: {
      color: theme.colors.white,
      fontSize: 14,
      fontWeight: '700',
    },
    label: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    labelDisabled: {
      color: theme.colors.textSecondary,
    },
    labelChecked: {
      textDecorationLine: 'line-through',
      color: theme.colors.textSecondary,
    },
    errorText: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
      marginLeft: 24 + theme.spacing.sm,
    },
  });
}

export function Checkbox({
  value,
  onValueChange,
  label,
  error,
  disabled = false,
  containerStyle,
}: CheckboxProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => !disabled && onValueChange(!value)}
        style={[styles.row, containerStyle && styles.rowFlex]}
        disabled={disabled}
      >
        <View style={[styles.box, value && styles.boxChecked]}>
          {value ? <Text style={styles.check}>✓</Text> : null}
        </View>
        <Text style={[styles.label, disabled && styles.labelDisabled, value && styles.labelChecked]}>
          {label}
        </Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
