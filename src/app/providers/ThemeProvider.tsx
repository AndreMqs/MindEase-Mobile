import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { theme as baseTheme } from '../../shared/theme';
import type { Theme, ThemeColors } from '../../shared/theme';
import type { ContrastLevel } from '../../domain/entities/Preferences';
import { usePreferences } from './PreferencesProvider';

function scaleFontSizes(fontSizePx: number) {
  const scale = fontSizePx / 16;
  const t = baseTheme.fontSizes;
  return {
    xs: Math.round(t.xs * scale),
    sm: Math.round(t.sm * scale),
    md: Math.round(t.md * scale),
    lg: Math.round(t.lg * scale),
    xl: Math.round(t.xl * scale),
    xxl: Math.round(t.xxl * scale),
    title: Math.round(t.title * scale),
  };
}

function scaleSpacing(spacingPx: number) {
  const scale = spacingPx / 8;
  const s = baseTheme.spacing;
  return {
    xs: Math.round(s.xs * scale),
    sm: Math.round(s.sm * scale),
    md: Math.round(s.md * scale),
    lg: Math.round(s.lg * scale),
    xl: Math.round(s.xl * scale),
    xxl: Math.round(s.xxl * scale),
  };
}

function getEffectiveColors(baseColors: ThemeColors, contrast: ContrastLevel): ThemeColors {
  if (contrast === 'normal') {
    return baseColors;
  }
  if (contrast === 'high') {
    return {
      ...baseColors,
      border: baseColors.borderHighContrast,
      textSecondary: baseColors.textSecondaryHighContrast,
    } as unknown as ThemeColors;
  }
  // veryHigh: máximo contraste — fundo preto, texto branco
  return {
    ...baseColors,
    background: '#000000',
    surface: '#0D0D0D',
    surfaceSecondary: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textSecondaryHighContrast: '#D6D7DD',
    border: 'rgba(255,255,255,0.25)',
    borderHighContrast: 'rgba(255,255,255,0.35)',
    borderDetailed: 'rgba(255,255,255,0.20)',
  } as unknown as ThemeColors;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { preferences } = usePreferences();

  const effectiveTheme = useMemo<Theme>(() => ({
    ...baseTheme,
    colors: getEffectiveColors(baseTheme.colors, preferences.contrast),
    fontSizes: scaleFontSizes(preferences.fontSizePx) as Theme['fontSizes'],
    spacing: scaleSpacing(preferences.spacingPx) as Theme['spacing'],
  }), [preferences.contrast, preferences.fontSizePx, preferences.spacingPx]);

  return (
    <ThemeContext.Provider value={effectiveTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

/**
 * Retorna o tema efetivo (respeitando preferências) ou o tema base se fora do provider.
 */
export function useThemeOptional(): Theme {
  const ctx = useContext(ThemeContext);
  return ctx ?? baseTheme;
}
