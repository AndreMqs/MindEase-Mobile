import type { IGamificationRepository } from '../../contracts/repositories/IGamificationRepository';
import type { GamificationState } from '../../entities/Gamification';

export class SaveGamificationStateUseCase {
  constructor(private readonly repository: IGamificationRepository) {}

  execute(userId: string, state: GamificationState) {
    return this.repository.save(userId, state);
  }
}
