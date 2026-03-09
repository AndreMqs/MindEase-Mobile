/**
 * Firebase via SDK JavaScript (Web).
 * Uma única config para iOS, Android e Web.
 * Compatível com Expo Go.
 */
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDMpGiN8QAvn6D2axKDITOiZGil2D9poIk',
  authDomain: 'mindease-19c82.firebaseapp.com',
  projectId: 'mindease-19c82',
  storageBucket: 'mindease-19c82.firebasestorage.app',
  messagingSenderId: '54485747949',
  appId: '1:54485747949:web:889640769b0dad54ee64e4',
  measurementId: 'G-CK7J44PC9M',
};

const app: FirebaseApp = getApps().length
  ? (getApps()[0] as FirebaseApp)
  : initializeApp(firebaseConfig);

export const isFirebaseConfigured = true;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
