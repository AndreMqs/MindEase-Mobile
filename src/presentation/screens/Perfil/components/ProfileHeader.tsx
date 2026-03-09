import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfileAvatar } from './ProfileAvatar';
import { useThemeOptional } from '../../../../app/providers';
import type { Theme } from '../../../../shared/theme';

export type ProfileHeaderData = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

type ProfileHeaderProps = {
  data: ProfileHeaderData;
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
    },
    name: {
      marginTop: theme.spacing.md,
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      textAlign: 'center',
    },
    email: {
      marginTop: theme.spacing.xs,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });
}

export function ProfileHeader({ data }: ProfileHeaderProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <ProfileAvatar photoURL={data.photoURL} displayName={data.displayName} />
      <Text style={styles.name} numberOfLines={2}>
        {data.displayName?.trim() || 'Usuário'}
      </Text>
      {data.email ? (
        <Text style={styles.email} numberOfLines={1}>
          {data.email}
        </Text>
      ) : null}
    </View>
  );
}
