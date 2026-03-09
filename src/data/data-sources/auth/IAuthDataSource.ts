import type { User } from '../../../domain/entities/User';
import type { SignInCredentials, SignUpCredentials } from '../../../domain/contracts/repositories/IAuthRepository';

/**
 * Porta do data source de autenticação.
 * A camada data define o contrato; a infra implementa com Firebase Auth.
 */
export interface IAuthDataSource {
  signIn(credentials: SignInCredentials): Promise<User>;
  signUp(credentials: SignUpCredentials): Promise<User>;
  signOut(): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  getCurrentUser(): User | null;
  subscribeAuthState(listener: (user: User | null) => void): () => void;
  updateProfile(displayName: string): Promise<void>;
  updateEmail(newEmail: string): Promise<void>;
  updatePassword(currentPassword: string, newPassword: string): Promise<void>;
}
