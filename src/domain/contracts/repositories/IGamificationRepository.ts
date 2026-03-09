import type { GamificationState } from '../../entities/Gamification';

export interface IGamificationRepository {
  get(userId: string): Promise<GamificationState>;
  save(userId: string, state: GamificationState): Promise<void>;
}
