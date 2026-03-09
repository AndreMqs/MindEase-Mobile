import type { User } from '../../entities/User';

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  displayName?: string;
  /** Nome para perfil (cadastro); também usado como displayName no Auth */
  name?: string;
  /** Aceite dos termos no cadastro */
  acceptedTerms?: boolean;
};

/**
 * Contrato do repositório de autenticação.
 * A presentation e os use cases dependem apenas desta interface.
 */
export interface IAuthRepository {
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
