import type { IDatabaseRepository } from '../../contracts/repositories/IDatabaseRepository';
import type { UserProfileData, UserDocument } from '../../entities/UserProfile';
import { defaultGamificationState } from '../../entities/Gamification';
import type { ICreateUserProfileUseCase } from './ICreateUserProfileUseCase';

const USERS_COLLECTION = 'users';

/**
 * Cria o documento do usuário no banco (estrutura escalável).
 * users/{userId}: { profile, preferences, settings, metadata }
 */
export class CreateUserProfileUseCase implements ICreateUserProfileUseCase {
  constructor(private readonly databaseRepository: IDatabaseRepository) {}

  async execute(userId: string, profile: UserProfileData): Promise<void> {
    const now = new Date().toISOString();
    const document: UserDocument = {
      profile: {
        ...profile,
        createdAt: profile.createdAt || now,
        updatedAt: profile.updatedAt || now,
      },
      preferences: {},
      settings: {},
      metadata: {},
      gamification: defaultGamificationState,
    };
    await this.databaseRepository.set(USERS_COLLECTION, userId, document);
  }
}
