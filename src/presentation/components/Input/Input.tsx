import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
} from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import type { Theme } from '../../../shared/theme';

const MIN_MULTILINE_HEIGHT = 80;
const MAX_MULTILINE_HEIGHT = 240;

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  /** Se true, o campo cresce para baixo conforme o texto (multiline). */
  multiline?: boolean;
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    inputMultiline: {
      minHeight: MIN_MULTILINE_HEIGHT,
      maxHeight: MAX_MULTILINE_HEIGHT,
      paddingVertical: theme.spacing.sm,
      textAlignVertical: 'top',
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });
}

export function Input({
  label,
  error,
  containerStyle,
  style,
  multiline = false,
  onContentSizeChange,
  ...rest
}: InputProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [contentHeight, setContentHeight] = useState(MIN_MULTILINE_HEIGHT);

  const handleContentSizeChange = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      if (multiline) {
        const h = e.nativeEvent.contentSize.height;
        setContentHeight(Math.min(MAX_MULTILINE_HEIGHT, Math.max(MIN_MULTILINE_HEIGHT, h + 24)));
      }
      onContentSizeChange?.(e);
    },
    [multiline, onContentSizeChange]
  );

  const inputStyle = [
    styles.input,
    multiline && styles.inputMultiline,
    multiline && { height: contentHeight },
    error ? styles.inputError : undefined,
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={inputStyle}
        placeholderTextColor={theme.colors.textSecondary}
        multiline={multiline}
        onContentSizeChange={handleContentSizeChange}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
