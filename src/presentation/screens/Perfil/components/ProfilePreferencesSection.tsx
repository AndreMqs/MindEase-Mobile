import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeOptional } from '../../../../app/providers';
import type { Preferences, ComplexityLevel, ContrastLevel } from '../../../../domain/entities/Preferences';
import type { Theme } from '../../../../shared/theme';

type ProfilePreferencesSectionProps = {
  preferences: Preferences;
};

const COMPLEXITY_LABELS: Record<ComplexityLevel, string> = {
  simple: 'Simples',
  standard: 'Padrão',
  detailed: 'Detalhado',
};

const CONTRAST_LABELS: Record<ContrastLevel, string> = {
  normal: 'Normal',
  high: 'Alto',
  veryHigh: 'Muito alto',
};

function PreferenceRow({
  label,
  chipValue,
  theme,
}: {
  label: string;
  chipValue: string;
  theme: Theme;
}) {
  const chipStyle = useMemo(
    () => ({
      backgroundColor: theme.colors.surfaceSecondary,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: 16,
    }),
    [theme]
  );
  const textStyle = useMemo(
    () => ({
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: '500' as const,
    }),
    [theme]
  );
  const labelStyle = useMemo(
    () => ({
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      flex: 1,
    }),
    [theme]
  );
  const rowStyle = useMemo(
    () => [{ flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const }, { marginBottom: theme.spacing.sm }],
    [theme]
  );

  return (
    <View style={rowStyle}>
      <Text style={labelStyle}>{label}</Text>
      <View style={chipStyle}>
        <Text style={textStyle}>{chipValue}</Text>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
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

export function ProfilePreferencesSection({ preferences }: ProfilePreferencesSectionProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const items = useMemo(
    () => [
      { label: 'Complexidade', value: COMPLEXITY_LABELS[preferences.complexity] },
      { label: 'Modo foco', value: preferences.focusMode ? 'Sim' : 'Não' },
      { label: 'Modo resumo', value: preferences.summaryMode ? 'Sim' : 'Não' },
      { label: 'Animações', value: preferences.animationsEnabled ? 'Sim' : 'Não' },
      { label: 'Contraste', value: CONTRAST_LABELS[preferences.contrast] },
      { label: 'Fonte', value: `${preferences.fontSizePx}px` },
      { label: 'Espaçamento', value: `${preferences.spacingPx}px` },
      { label: 'Alertas cognitivos', value: preferences.cognitiveAlertsEnabled ? 'Sim' : 'Não' },
    ],
    [preferences]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preferências</Text>
      {items.map(({ label, value }) => (
        <PreferenceRow key={label} label={label} chipValue={value} theme={theme} />
      ))}
    </View>
  );
}
