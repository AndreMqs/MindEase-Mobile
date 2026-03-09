/**
 * Contrato para analytics (eventos, userId, user properties).
 * Implementação pode ser nativa (Firebase) ou web (Measurement Protocol).
 */
export interface IAnalyticsRepository {
  logEvent(name: string, params?: Record<string, unknown>): Promise<void>;
  setUserId(userId: string | null): Promise<void>;
  setUserProperty(name: string, value: string | null): Promise<void>;
}
