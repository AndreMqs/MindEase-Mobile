import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import type { Theme } from '../../../shared/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    button: {
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 120,
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    disabled: {
      opacity: 0.6,
    },
    text: {
      fontSize: theme.fontSizes.md,
      fontWeight: '800' as const,
    },
    text_primary: {
      color: theme.colors.white,
    },
    text_secondary: {
      color: theme.colors.white,
    },
    text_outline: {
      color: theme.colors.primary,
    },
  });
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? theme.colors.primary : theme.colors.white}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`text_${variant}` as keyof ReturnType<typeof createStyles>],
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
