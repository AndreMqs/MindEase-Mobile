/**
 * Configuração única do Analytics (GA4 Measurement Protocol).
 * Funciona em iOS e Android com a mesma config.
 *
 * No Expo: use variáveis EXPO_PUBLIC_* no app.config ou .env.
 */
export type FirebaseAnalyticsConfig = {
  measurementId: string;
  apiSecret: string;
};

function getConfig(): FirebaseAnalyticsConfig | null {
  const envId =
    typeof process !== 'undefined' &&
    (process.env?.EXPO_PUBLIC_GA_MEASUREMENT_ID ?? process.env?.REACT_APP_GA_MEASUREMENT_ID);
  const envSecret =
    typeof process !== 'undefined' &&
    (process.env?.EXPO_PUBLIC_GA_API_SECRET ?? process.env?.REACT_APP_GA_API_SECRET);
  if (envId && envSecret) {
    return { measurementId: String(envId), apiSecret: String(envSecret) };
  }
  const staticConfig: FirebaseAnalyticsConfig | null = null as FirebaseAnalyticsConfig | null;
  if (staticConfig && staticConfig.measurementId && staticConfig.apiSecret) {
    return staticConfig;
  }
  return null;
}

export const firebaseAnalyticsConfig = getConfig();
