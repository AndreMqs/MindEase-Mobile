import type { IDatabaseRepository } from '../../domain/contracts/repositories/IDatabaseRepository';
import type { IGamificationRepository } from '../../domain/contracts/repositories/IGamificationRepository';
import {
  defaultGamificationState,
  type GamificationState,
  type RewardItem,
  type RedemptionHistoryItem,
} from '../../domain/entities/Gamification';

const USERS_COLLECTION = 'users';

type UserDoc = {
  gamification?: Partial<GamificationState>;
};

function mapReward(raw: unknown): RewardItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  return {
    id: String(o.id ?? ''),
    title: String(o.title ?? ''),
    cost: typeof o.cost === 'number' ? o.cost : Number(o.cost ?? 0),
    createdAtISO: typeof o.createdAtISO === 'string' ? o.createdAtISO : new Date().toISOString(),
  };
}

function mapHistory(raw: unknown): RedemptionHistoryItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  return {
    id: String(o.id ?? ''),
    rewardId: String(o.rewardId ?? ''),
    title: String(o.title ?? ''),
    cost: typeof o.cost === 'number' ? o.cost : Number(o.cost ?? 0),
    redeemedAtISO: typeof o.redeemedAtISO === 'string' ? o.redeemedAtISO : new Date().toISOString(),
  };
}

export class GamificationRepository implements IGamificationRepository {
  constructor(private readonly databaseRepository: IDatabaseRepository) {}

  async get(userId: string): Promise<GamificationState> {
    const doc = await this.databaseRepository.get<UserDoc>(USERS_COLLECTION, userId);
    const raw = doc?.gamification;
    if (!raw || typeof raw !== 'object') return defaultGamificationState;
    return {
      pointsBalance: typeof raw.pointsBalance === 'number' ? raw.pointsBalance : 0,
      pointsSpent: typeof raw.pointsSpent === 'number' ? raw.pointsSpent : 0,
      pointsTotalEarned: typeof raw.pointsTotalEarned === 'number' ? raw.pointsTotalEarned : 0,
      completedTaskIds: Array.isArray(raw.completedTaskIds) ? raw.completedTaskIds.map((id) => String(id)) : [],
      rewards: Array.isArray(raw.rewards) ? raw.rewards.map(mapReward).filter(Boolean) as RewardItem[] : [],
      redemptionHistory: Array.isArray(raw.redemptionHistory)
        ? raw.redemptionHistory.map(mapHistory).filter(Boolean) as RedemptionHistoryItem[]
        : [],
    };
  }

  async save(userId: string, state: GamificationState): Promise<void> {
    await this.databaseRepository.update(USERS_COLLECTION, userId, { gamification: state });
  }
}
