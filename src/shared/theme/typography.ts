/**
 * Tipografia base.
 * Tamanhos e pesos para textos.
 */
import { Platform } from 'react-native';

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 28,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const defaultFontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  fontSizes,
  fontWeights,
  lineHeights,
  defaultFontFamily,
};

export type FontSizes = typeof fontSizes;
export type FontWeights = typeof fontWeights;
