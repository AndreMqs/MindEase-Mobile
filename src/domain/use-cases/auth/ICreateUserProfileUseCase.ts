import type { UserProfileData } from '../../entities/UserProfile';

export interface ICreateUserProfileUseCase {
  execute(userId: string, profile: UserProfileData): Promise<void>;
}
