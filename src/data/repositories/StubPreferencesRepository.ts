import type { IPreferencesRepository } from '../../domain/contracts/repositories/IPreferencesRepository';
import type { Preferences } from '../../domain/entities/Preferences';
import { defaultPreferences } from '../../domain/entities/Preferences';

/**
 * Stub: retorna padrões e ignora set quando Firebase não está configurado.
 */
export class StubPreferencesRepository implements IPreferencesRepository {
  async get(_userId: string): Promise<Preferences> {
    return { ...defaultPreferences };
  }

  async set(_userId: string, _preferences: Preferences): Promise<void> {
    // no-op
  }
}
