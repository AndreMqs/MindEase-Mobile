import React, { useMemo } from 'react';
import { View, ViewStyle, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeOptional } from '../../../app/providers';
import type { Theme } from '../../../shared/theme';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  centered?: boolean;
  withKeyboard?: boolean;
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      justifyContent: 'center',
    },
  });
}

export function ScreenContainer({
  children,
  style,
  centered = false,
  withKeyboard = false,
}: ScreenContainerProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left + theme.spacing.md,
      paddingRight: insets.right + theme.spacing.md,
    },
    centered && styles.centered,
    style,
  ];

  if (withKeyboard) {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={containerStyle}>{children}</View>
      </KeyboardAvoidingView>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}
