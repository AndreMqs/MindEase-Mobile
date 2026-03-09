import type { IGamificationRepository } from '../../contracts/repositories/IGamificationRepository';

export class GetGamificationStateUseCase {
  constructor(private readonly repository: IGamificationRepository) {}

  execute(userId: string) {
    return this.repository.get(userId);
  }
}
