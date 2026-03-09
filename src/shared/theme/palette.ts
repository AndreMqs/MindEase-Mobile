/**
 * MindEase — paleta única (acessibilidade cognitiva).
 * Fonte da verdade para cores. Mesma estrutura do MindEase (web).
 */

export const palette = {
  // Fundos
  bgMain: '#0F1115',
  surface: '#171A21',
  surfaceSecondary: '#1D2230',

  // Texto
  textPrimary: '#F5F7FA',
  textSecondary: '#AAB2BF',
  textSecondaryHighContrast: '#D6D7DD',

  // Ação / destaque
  accent: '#4C9AFF',
  accentHover: '#6AAEFF',

  // Semânticas
  success: '#4CAF50',
  warning: '#F59E0B',

  // Bordas
  border: 'rgba(255,255,255,0.08)',
  borderHighContrast: 'rgba(255,255,255,0.18)',
  borderDetailed: 'rgba(255,255,255,0.10)',

  // Focus outline (acessibilidade)
  focusOutline: 'rgba(76, 154, 255, 0.25)',
  inputFocusRing: 'rgba(76, 154, 255, 0.2)',
  menuSelected: 'rgba(76, 154, 255, 0.16)',
  menuSelectedHover: 'rgba(76, 154, 255, 0.22)',
} as const;

export type Palette = typeof palette;
