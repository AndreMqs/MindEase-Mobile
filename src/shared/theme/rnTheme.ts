/**
 * Tema React Native derivado da paleta (fonte única).
 * Mesma abordagem do MindEase: cores vêm de palette; spacing e typography são específicos do RN.
 */
import { palette } from './palette';
import { spacing } from './spacing';
import { typography } from './typography';

/** Cores do app mapeadas a partir da paleta MindEase + tokens extras para RN */
const colors = {
  // Da paleta
  background: palette.bgMain,
  surface: palette.surface,
  surfaceSecondary: palette.surfaceSecondary,
  text: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textSecondaryHighContrast: palette.textSecondaryHighContrast,
  primary: palette.accent,
  primaryLight: palette.accentHover,
  secondary: palette.accent,
  success: palette.success,
  warning: palette.warning,
  border: palette.border,
  borderHighContrast: palette.borderHighContrast,
  borderDetailed: palette.borderDetailed,
  focusOutline: palette.focusOutline,
  inputFocusRing: palette.inputFocusRing,
  menuSelected: palette.menuSelected,
  menuSelectedHover: palette.menuSelectedHover,
  buttonText: palette.textPrimary,
  // Semânticos/tokens RN (não presentes na paleta web)
  error: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const theme = {
  colors,
  spacing,
  fontSizes: typography.fontSizes,
  fontWeights: typography.fontWeights,
  lineHeights: typography.lineHeights,
  defaultFontFamily: typography.defaultFontFamily,
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof colors;
