import type { IAuthRepository, SignUpCredentials } from '../../contracts/repositories/IAuthRepository';
import type { User } from '../../entities/User';
import type { ICreateUserProfileUseCase } from './ICreateUserProfileUseCase';

export type SignUpResult = { success: true; user: User } | { success: false; error: string };

/**
 * Caso de uso: cadastrar novo usuário no Auth e persistir perfil no banco.
 */
export class SignUpUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly createUserProfile: ICreateUserProfileUseCase
  ) {}

  async execute(credentials: SignUpCredentials): Promise<SignUpResult> {
    try {
      const signUpPayload = {
        email: credentials.email,
        password: credentials.password,
        displayName: credentials.name ?? credentials.displayName,
      };
      const user = await this.authRepository.signUp(signUpPayload);

      if (credentials.name != null && credentials.acceptedTerms === true) {
        const now = new Date().toISOString();
        await this.createUserProfile.execute(user.id, {
          name: credentials.name,
          email: credentials.email,
          acceptedTerms: true,
          createdAt: now,
          updatedAt: now,
        });
      }

      return { success: true, user };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: message };
    }
  }
}
