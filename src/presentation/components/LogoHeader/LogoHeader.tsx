import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import { APP_NAME } from '../../../shared/constants';
import type { Theme } from '../../../shared/theme';

function createStyles(theme: Theme) {
  return StyleSheet.create({
    logo: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.primary,
      letterSpacing: 1,
    },
  });
}

export function LogoHeader() {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return <Text style={styles.logo}>{APP_NAME}</Text>;
}
