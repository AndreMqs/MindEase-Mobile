/**
 * Composition root: monta todas as dependências da aplicação.
 * Usa Firebase Web SDK (src/lib/firebase.ts) – compatível com Expo Go.
 */

import { isFirebaseConfigured } from '../../lib/firebase';
import { FirebaseAuthDataSource } from '../../infra/firebase/data-sources/FirebaseAuthDataSource';
import { FirebaseFirestoreDataSource } from '../../infra/firebase/data-sources/FirebaseFirestoreDataSource';
import { FirebaseStorageDataSource } from '../../infra/firebase/data-sources/FirebaseStorageDataSource';
import { AuthRepository } from '../../data/repositories/AuthRepository';
import { StubAuthRepository } from '../../data/repositories/StubAuthRepository';
import { FirestoreDatabaseRepository } from '../../data/repositories/FirestoreDatabaseRepository';
import { StorageRepository } from '../../data/repositories/StorageRepository';
import { LoginUseCase } from '../../domain/use-cases/auth/LoginUseCase';
import { SignUpUseCase } from '../../domain/use-cases/auth/SignUpUseCase';
import { CreateUserProfileUseCase } from '../../domain/use-cases/auth/CreateUserProfileUseCase';
import { StubCreateUserProfileUseCase } from '../../domain/use-cases/auth/StubCreateUserProfileUseCase';
import { SendPasswordResetUseCase } from '../../domain/use-cases/auth/SendPasswordResetUseCase';
import { GetUserPreferencesUseCase } from '../../domain/use-cases/preferences/GetUserPreferencesUseCase';
import { SetUserPreferencesUseCase } from '../../domain/use-cases/preferences/SetUserPreferencesUseCase';
import { PreferencesRepository } from '../../data/repositories/PreferencesRepository';
import { StubPreferencesRepository } from '../../data/repositories/StubPreferencesRepository';
import { TasksRepository } from '../../data/repositories/TasksRepository';
import { StubTasksRepository } from '../../data/repositories/StubTasksRepository';
import { ListTasksUseCase } from '../../domain/use-cases/tasks/ListTasksUseCase';
import { CreateTaskUseCase } from '../../domain/use-cases/tasks/CreateTaskUseCase';
import { UpdateTaskUseCase } from '../../domain/use-cases/tasks/UpdateTaskUseCase';
import { MoveTaskUseCase } from '../../domain/use-cases/tasks/MoveTaskUseCase';
import { RemoveTaskUseCase } from '../../domain/use-cases/tasks/RemoveTaskUseCase';
import type { IAuthRepository } from '../../domain/contracts/repositories/IAuthRepository';
import type { IDatabaseRepository } from '../../domain/contracts/repositories/IDatabaseRepository';
import type { IPreferencesRepository } from '../../domain/contracts/repositories/IPreferencesRepository';
import type { ITasksRepository } from '../../domain/contracts/repositories/ITasksRepository';
import type { IStorageRepository } from '../../domain/contracts/repositories/IStorageRepository';

let authRepository: IAuthRepository | null = null;
let databaseRepository: IDatabaseRepository | null = null;
let preferencesRepository: IPreferencesRepository | null = null;
let tasksRepository: ITasksRepository | null = null;
let storageRepository: IStorageRepository | null = null;
let loginUseCase: LoginUseCase | null = null;
let signUpUseCase: SignUpUseCase | null = null;
let sendPasswordResetUseCase: SendPasswordResetUseCase | null = null;
let getUserPreferencesUseCase: GetUserPreferencesUseCase | null = null;
let setUserPreferencesUseCase: SetUserPreferencesUseCase | null = null;
let listTasksUseCase: ListTasksUseCase | null = null;
let createTaskUseCase: CreateTaskUseCase | null = null;
let updateTaskUseCase: UpdateTaskUseCase | null = null;
let moveTaskUseCase: MoveTaskUseCase | null = null;
let removeTaskUseCase: RemoveTaskUseCase | null = null;

function buildContainer(): boolean {
  if (!isFirebaseConfigured) {
    if (__DEV__) {
      console.warn('[MindEaseMobile] Firebase not configured. Preencha src/lib/firebase.ts ou use variáveis de ambiente.');
    }
    authRepository = new StubAuthRepository();
    const stubCreateProfile = new StubCreateUserProfileUseCase();
    preferencesRepository = new StubPreferencesRepository();
    loginUseCase = new LoginUseCase(authRepository);
    signUpUseCase = new SignUpUseCase(authRepository, stubCreateProfile);
    sendPasswordResetUseCase = new SendPasswordResetUseCase(authRepository);
    getUserPreferencesUseCase = new GetUserPreferencesUseCase(preferencesRepository);
    setUserPreferencesUseCase = new SetUserPreferencesUseCase(preferencesRepository);
    tasksRepository = new StubTasksRepository();
    listTasksUseCase = new ListTasksUseCase(tasksRepository);
    createTaskUseCase = new CreateTaskUseCase(tasksRepository);
    updateTaskUseCase = new UpdateTaskUseCase(tasksRepository);
    moveTaskUseCase = new MoveTaskUseCase(tasksRepository);
    removeTaskUseCase = new RemoveTaskUseCase(tasksRepository);
    databaseRepository = null;
    storageRepository = null;
    return false;
  }

  const authDataSource = new FirebaseAuthDataSource();
  const firestoreDataSource = new FirebaseFirestoreDataSource();
  const storageDataSource = new FirebaseStorageDataSource();

  authRepository = new AuthRepository(authDataSource);
  databaseRepository = new FirestoreDatabaseRepository(firestoreDataSource);
  storageRepository = new StorageRepository(storageDataSource);

  const createUserProfileUseCase = new CreateUserProfileUseCase(databaseRepository);
  preferencesRepository = new PreferencesRepository(databaseRepository);
  loginUseCase = new LoginUseCase(authRepository);
  signUpUseCase = new SignUpUseCase(authRepository, createUserProfileUseCase);
  sendPasswordResetUseCase = new SendPasswordResetUseCase(authRepository);
  getUserPreferencesUseCase = new GetUserPreferencesUseCase(preferencesRepository);
  setUserPreferencesUseCase = new SetUserPreferencesUseCase(preferencesRepository);
  tasksRepository = new TasksRepository(databaseRepository);
  listTasksUseCase = new ListTasksUseCase(tasksRepository);
  createTaskUseCase = new CreateTaskUseCase(tasksRepository);
  updateTaskUseCase = new UpdateTaskUseCase(tasksRepository);
  moveTaskUseCase = new MoveTaskUseCase(tasksRepository);
  removeTaskUseCase = new RemoveTaskUseCase(tasksRepository);
  return true;
}

/**
 * Inicializa o container (chamar no bootstrap do app).
 * Se o Firebase não estiver configurado em src/lib/firebase.ts, usa stubs (app abre normalmente).
 */
export function initContainer(): void {
  if (!authRepository) {
    buildContainer();
  }
}

const FIREBASE_NOT_CONFIGURED =
  'Firebase not configured. Preencha firebaseConfig em src/lib/firebase.ts ou defina as variáveis de ambiente.';

function ensureContainer(): void {
  if (!authRepository) {
    buildContainer();
  }
}

export function getAuthRepository(): IAuthRepository {
  ensureContainer();
  return authRepository!;
}

export function getDatabaseRepository(): IDatabaseRepository {
  ensureContainer();
  if (!databaseRepository) throw new Error(FIREBASE_NOT_CONFIGURED);
  return databaseRepository;
}

export function getStorageRepository(): IStorageRepository {
  ensureContainer();
  if (!storageRepository) throw new Error(FIREBASE_NOT_CONFIGURED);
  return storageRepository;
}

export function getLoginUseCase(): LoginUseCase {
  if (!loginUseCase) getAuthRepository();
  return loginUseCase!;
}

export function getSignUpUseCase(): SignUpUseCase {
  if (!signUpUseCase) getAuthRepository();
  return signUpUseCase!;
}

export function getSendPasswordResetUseCase(): SendPasswordResetUseCase {
  if (!sendPasswordResetUseCase) getAuthRepository();
  return sendPasswordResetUseCase!;
}

export function getGetUserPreferencesUseCase(): GetUserPreferencesUseCase {
  ensureContainer();
  return getUserPreferencesUseCase!;
}

export function getSetUserPreferencesUseCase(): SetUserPreferencesUseCase {
  ensureContainer();
  return setUserPreferencesUseCase!;
}

export function getListTasksUseCase(): ListTasksUseCase {
  ensureContainer();
  return listTasksUseCase!;
}

export function getCreateTaskUseCase(): CreateTaskUseCase {
  ensureContainer();
  return createTaskUseCase!;
}

export function getUpdateTaskUseCase(): UpdateTaskUseCase {
  ensureContainer();
  return updateTaskUseCase!;
}

export function getMoveTaskUseCase(): MoveTaskUseCase {
  ensureContainer();
  return moveTaskUseCase!;
}

export function getRemoveTaskUseCase(): RemoveTaskUseCase {
  ensureContainer();
  return removeTaskUseCase!;
}
