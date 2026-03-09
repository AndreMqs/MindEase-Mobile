/**
 * Configuração de ambiente.
 * Valores sensíveis: use GoogleService-Info.plist (iOS) e google-services.json (Android)
 * para o Firebase. Para overrides ou feature flags, use EXPO_PUBLIC_* ou app.config.
 */
export const env = {
  /** Ativo apenas se você definir EXPO_PUBLIC_ENABLE_ANALYTICS=1 ou equivalente */
  enableAnalytics: true,
} as const;
