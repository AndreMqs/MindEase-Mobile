import type { IPreferencesRepository } from '../../contracts/repositories/IPreferencesRepository';
import type { Preferences } from '../../entities/Preferences';

/**
 * Persiste as preferências do usuário (Firestore).
 */
export class SetUserPreferencesUseCase {
  constructor(private readonly preferencesRepository: IPreferencesRepository) {}

  async execute(userId: string, preferences: Preferences): Promise<void> {
    await this.preferencesRepository.set(userId, preferences);
  }
}
