import type { IAuthRepository, SignInCredentials } from '../../contracts/repositories/IAuthRepository';
import type { User } from '../../entities/User';

export type LoginResult = { success: true; user: User } | { success: false; error: string };

/**
 * Caso de uso: fazer login com email e senha.
 * Depende apenas do contrato IAuthRepository (inversão de dependência).
 */
export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: SignInCredentials): Promise<LoginResult> {
    try {
      const user = await this.authRepository.signIn(credentials);
      return { success: true, user };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: message };
    }
  }
}
