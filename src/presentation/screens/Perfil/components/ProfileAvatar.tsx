import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeOptional } from '../../../../app/providers';
import type { Theme } from '../../../../shared/theme';

type ProfileAvatarProps = {
  photoURL: string | null;
  displayName: string | null;
};

const size = 96;

function createStyles(theme: Theme) {
  return StyleSheet.create({
    avatar: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.surface,
    },
    placeholder: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: {
      fontSize: 32,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.white,
    },
  });
}

function getInitials(name: string | null): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** Avatar do usuário: exibe foto se existir, senão iniciais em círculo (placeholder). */
export function ProfileAvatar({ photoURL, displayName }: ProfileAvatarProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const initials = getInitials(displayName);

  if (photoURL) {
    return (
      <Image
        source={{ uri: photoURL }}
        style={styles.avatar}
        accessibilityLabel="Foto do usuário"
      />
    );
  }

  return (
    <View style={styles.placeholder}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}
