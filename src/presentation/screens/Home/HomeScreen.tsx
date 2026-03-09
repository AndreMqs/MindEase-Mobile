import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components';
import { useThemeOptional } from '../../../app/providers';
import type { Theme } from '../../../shared/theme';

function createStyles(theme: Theme) {
  return StyleSheet.create({
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
    },
  });
}

export function HomeScreen() {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Home</Text>
      </View>
    </ScreenContainer>
  );
}
