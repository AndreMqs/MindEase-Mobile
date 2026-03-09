import type { IDatabaseRepository } from '../../domain/contracts/repositories/IDatabaseRepository';
import type { IPreferencesRepository } from '../../domain/contracts/repositories/IPreferencesRepository';
import type { Preferences } from '../../domain/entities/Preferences';
import { defaultPreferences } from '../../domain/entities/Preferences';

const USERS_COLLECTION = 'users';

type UserDocument = {
  id?: string;
  profile?: unknown;
  preferences?: Partial<Preferences>;
  settings?: unknown;
  metadata?: unknown;
};

/**
 * Persiste preferências em users/{userId}.preferences (Firestore).
 * Outras plataformas (ex.: MindEase web) podem ler o mesmo documento.
 */
export class PreferencesRepository implements IPreferencesRepository {
  constructor(private readonly databaseRepository: IDatabaseRepository) {}

  async get(userId: string): Promise<Preferences> {
    const doc = await this.databaseRepository.get<UserDocument>(USERS_COLLECTION, userId);
    const raw = doc?.preferences;
    if (!raw || typeof raw !== 'object') return { ...defaultPreferences };
    return {
      ...defaultPreferences,
      ...raw,
      complexity: (raw.complexity as Preferences['complexity']) ?? defaultPreferences.complexity,
      contrast: (raw.contrast as Preferences['contrast']) ?? defaultPreferences.contrast,
      fontSizePx: typeof raw.fontSizePx === 'number' ? raw.fontSizePx : defaultPreferences.fontSizePx,
      spacingPx: typeof raw.spacingPx === 'number' ? raw.spacingPx : defaultPreferences.spacingPx,
    };
  }

  async set(userId: string, preferences: Preferences): Promise<void> {
    await this.databaseRepository.update(USERS_COLLECTION, userId, { preferences });
  }
}
