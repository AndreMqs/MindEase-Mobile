import type { IAuthRepository, SignInCredentials, SignUpCredentials } from '../../domain/contracts/repositories/IAuthRepository';
import type { User } from '../../domain/entities/User';
import type { IAuthDataSource } from '../data-sources/auth/IAuthDataSource';

/**
 * Implementação do repositório de autenticação.
 * Depende apenas do contrato IAuthDataSource (inversão de dependência).
 * A implementação concreta (Firebase) fica na infra.
 */
export class AuthRepository implements IAuthRepository {
  constructor(private readonly authDataSource: IAuthDataSource) {}

  async signIn(credentials: SignInCredentials): Promise<User> {
    return this.authDataSource.signIn(credentials);
  }

  async signUp(credentials: SignUpCredentials): Promise<User> {
    return this.authDataSource.signUp(credentials);
  }

  async signOut(): Promise<void> {
    return this.authDataSource.signOut();
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    return this.authDataSource.sendPasswordResetEmail(email);
  }

  getCurrentUser(): User | null {
    return this.authDataSource.getCurrentUser();
  }

  subscribeAuthState(listener: (user: User | null) => void): () => void {
    return this.authDataSource.subscribeAuthState(listener);
  }

  async updateProfile(displayName: string): Promise<void> {
    return this.authDataSource.updateProfile(displayName);
  }

  async updateEmail(newEmail: string): Promise<void> {
    return this.authDataSource.updateEmail(newEmail);
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.authDataSource.updatePassword(currentPassword, newPassword);
  }
}
