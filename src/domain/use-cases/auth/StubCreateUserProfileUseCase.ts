import type { UserProfileData } from '../../entities/UserProfile';
import type { ICreateUserProfileUseCase } from './ICreateUserProfileUseCase';

/**
 * Stub para quando o Firebase não está configurado (execute não persiste).
 */
export class StubCreateUserProfileUseCase implements ICreateUserProfileUseCase {
  async execute(_userId: string, _profile: UserProfileData): Promise<void> {
    // no-op
  }
}
