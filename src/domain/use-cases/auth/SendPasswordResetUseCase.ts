import type { IAuthRepository } from '../../contracts/repositories/IAuthRepository';

export type SendPasswordResetResult = { success: true } | { success: false; error: string };

/**
 * Caso de uso: enviar e-mail de recuperação de senha.
 */
export class SendPasswordResetUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string): Promise<SendPasswordResetResult> {
    try {
      await this.authRepository.sendPasswordResetEmail(email.trim());
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: message };
    }
  }
}
