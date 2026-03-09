import type { Preferences } from '../../entities/Preferences';

/**
 * Contrato para persistência de preferências do usuário.
 * Permite implementação Firestore (users/{userId}.preferences) ou local.
 */
export interface IPreferencesRepository {
  get(userId: string): Promise<Preferences>;
  set(userId: string, preferences: Preferences): Promise<void>;
}
