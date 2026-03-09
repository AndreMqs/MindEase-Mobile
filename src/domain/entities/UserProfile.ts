import type { GamificationState } from './Gamification';

/**
 * Dados de perfil do usuário persistidos no banco (Firestore).
 * Estrutura escalável: profile + preferences/settings/metadata para evolução futura.
 */
export type UserProfileData = {
  name: string;
  email: string;
  acceptedTerms: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type UserDocument = {
  profile: UserProfileData;
  preferences: Record<string, unknown>;
  settings: Record<string, unknown>;
  metadata: Record<string, unknown>;
  gamification: GamificationState;
};
