/**
 * Tipos compartilhados do módulo Firebase.
 * Isolados na camada infra para não vazar para domain.
 */

export type FirebaseModule = 'app' | 'auth' | 'firestore' | 'storage';

export type FirebaseInitResult = {
  success: boolean;
  error?: string;
};
