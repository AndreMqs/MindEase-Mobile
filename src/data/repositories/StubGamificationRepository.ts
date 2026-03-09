import type { IGamificationRepository } from '../../domain/contracts/repositories/IGamificationRepository';
import { defaultGamificationState, type GamificationState } from '../../domain/entities/Gamification';

const memory = new Map<string, GamificationState>();

export class StubGamificationRepository implements IGamificationRepository {
  async get(userId: string): Promise<GamificationState> {
    return memory.get(userId) ?? defaultGamificationState;
  }

  async save(userId: string, state: GamificationState): Promise<void> {
    memory.set(userId, state);
  }
}
