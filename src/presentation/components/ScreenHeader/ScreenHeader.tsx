import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeOptional } from '../../../app/providers';
import type { Theme } from '../../../shared/theme';

type ScreenHeaderProps = {
  onBack?: () => void;
  title?: string;
};

const HEADER_TOP_OFFSET = 4;

function createStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: {
      paddingBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: {
      fontSize: 32,
      color: theme.colors.text,
      fontWeight: '300',
      marginLeft: -2,
    },
    backPlaceholder: {
      width: 44,
      height: 44,
    },
    title: {
      flex: 1,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      textAlign: 'center',
      marginLeft: theme.spacing.md,
    },
    spacer: {
      width: 44,
    },
  });
}

export function ScreenHeader({ onBack, title }: ScreenHeaderProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const paddingTop = Math.max(HEADER_TOP_OFFSET, insets.top);

  return (
    <View style={[styles.wrapper, { paddingTop }]}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        <View style={styles.spacer} />
      </View>
    </View>
  );
}
