import type { IPreferencesRepository } from '../../contracts/repositories/IPreferencesRepository';
import type { Preferences } from '../../entities/Preferences';

/**
 * Obtém as preferências do usuário (Firestore ou padrão).
 */
export class GetUserPreferencesUseCase {
  constructor(private readonly preferencesRepository: IPreferencesRepository) {}

  async execute(userId: string): Promise<Preferences> {
    return this.preferencesRepository.get(userId);
  }
}
