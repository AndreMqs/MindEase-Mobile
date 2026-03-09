import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import type { IAuthDataSource } from '../../../data/data-sources/auth/IAuthDataSource';
import type { User } from '../../../domain/entities/User';
import type { SignInCredentials, SignUpCredentials } from '../../../domain/contracts/repositories/IAuthRepository';

function mapFirebaseUserToUser(fbUser: FirebaseUser): User {
  return {
    id: fbUser.uid,
    email: fbUser.email ?? null,
    displayName: fbUser.displayName ?? null,
    photoURL: fbUser.photoURL ?? null,
  };
}

/**
 * Implementação do data source de autenticação usando Firebase Auth (Web SDK).
 * Uma única config em src/lib/firebase.ts para iOS, Android e Web.
 * Compatível com Expo Go.
 */
export class FirebaseAuthDataSource implements IAuthDataSource {
  async signIn(credentials: SignInCredentials): Promise<User> {
    const { user } = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    return mapFirebaseUserToUser(user);
  }

  async signUp(credentials: SignUpCredentials): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    if (credentials.displayName) {
      await firebaseUpdateProfile(user, { displayName: credentials.displayName });
      return mapFirebaseUserToUser({ ...user, displayName: credentials.displayName } as FirebaseUser);
    }
    return mapFirebaseUserToUser(user);
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await firebaseSendPasswordResetEmail(auth, email);
  }

  getCurrentUser(): User | null {
    const fbUser = auth.currentUser;
    if (!fbUser) return null;
    return mapFirebaseUserToUser(fbUser);
  }

  subscribeAuthState(listener: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (fbUser) => {
      listener(fbUser ? mapFirebaseUserToUser(fbUser) : null);
    });
  }

  async updateProfile(displayName: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');
    await firebaseUpdateProfile(user, { displayName });
  }

  async updateEmail(newEmail: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');
    await firebaseUpdateEmail(user, newEmail);
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('Usuário não autenticado.');
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);
    await firebaseUpdatePassword(user, newPassword);
  }
}
