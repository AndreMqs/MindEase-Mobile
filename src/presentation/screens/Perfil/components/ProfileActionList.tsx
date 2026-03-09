import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfileActionItem } from './ProfileActionItem';
import { ProfileActionItemDanger } from './ProfileActionItemDanger';
import { useThemeOptional } from '../../../../app/providers';
import type { Theme } from '../../../../shared/theme';

export type ProfileAction = {
  id: string;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
};

type ProfileActionListProps = {
  title?: string;
  actions: ProfileAction[];
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });
}

export function ProfileActionList({ title = 'Opções', actions }: ProfileActionListProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actions.map((action) =>
        action.variant === 'danger' ? (
          <ProfileActionItemDanger
            key={action.id}
            title={action.title}
            onPress={action.onPress}
            disabled={action.disabled}
          />
        ) : (
          <ProfileActionItem
            key={action.id}
            title={action.title}
            onPress={action.onPress}
            disabled={action.disabled}
          />
        )
      )}
    </View>
  );
}
