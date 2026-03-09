export type RewardItem = {
  id: string;
  title: string;
  cost: number;
  createdAtISO: string;
};

export type RedemptionHistoryItem = {
  id: string;
  rewardId: string;
  title: string;
  cost: number;
  redeemedAtISO: string;
};

export type GamificationState = {
  pointsBalance: number;
  pointsSpent: number;
  pointsTotalEarned: number;
  completedTaskIds: string[];
  rewards: RewardItem[];
  redemptionHistory: RedemptionHistoryItem[];
};

export const defaultGamificationState: GamificationState = {
  pointsBalance: 0,
  pointsSpent: 0,
  pointsTotalEarned: 0,
  completedTaskIds: [],
  rewards: [],
  redemptionHistory: [],
};
