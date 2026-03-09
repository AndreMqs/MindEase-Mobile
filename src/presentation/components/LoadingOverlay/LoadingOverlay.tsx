import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import type { Theme } from '../../../shared/theme';

type LoadingOverlayProps = {
  visible: boolean;
  message?: string;
};

export function LoadingOverlay({ visible, message = 'Salvando…' }: LoadingOverlayProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!visible) return null;

  return (
    <View style={styles.backdrop} pointerEvents="auto">
      <View style={styles.card}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(10, 14, 25, 0.38)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      elevation: 12,
    },
    card: {
      minWidth: 180,
      maxWidth: 260,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 20,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      alignItems: 'center',
      gap: theme.spacing.md,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    message: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.sm,
      textAlign: 'center',
      fontWeight: theme.fontWeights.medium,
    },
  });
}
