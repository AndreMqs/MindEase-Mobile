import type { IAuthRepository, SignInCredentials, SignUpCredentials } from '../../domain/contracts/repositories/IAuthRepository';
import type { User } from '../../domain/entities/User';

const MSG = 'Firebase not configured. Add GoogleService-Info.plist (iOS) and google-services.json (Android).';

/**
 * Stub que implementa IAuthRepository e lança ao ser usado.
 * Permite o app abrir mesmo sem Firebase configurado.
 */
export class StubAuthRepository implements IAuthRepository {
  async signIn(_: SignInCredentials): Promise<User> {
    throw new Error(MSG);
  }

  async signUp(_: SignUpCredentials): Promise<User> {
    throw new Error(MSG);
  }

  async signOut(): Promise<void> {
    throw new Error(MSG);
  }

  async sendPasswordResetEmail(_email: string): Promise<void> {
    throw new Error(MSG);
  }

  getCurrentUser(): User | null {
    return null;
  }

  subscribeAuthState(listener: (user: User | null) => void): () => void {
    listener(null);
    return () => {};
  }

  async updateProfile(_displayName: string): Promise<void> {
    throw new Error(MSG);
  }

  async updateEmail(_newEmail: string): Promise<void> {
    throw new Error(MSG);
  }

  async updatePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    throw new Error(MSG);
  }
}
