import React, { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import {
  initContainer,
  getAuthRepository,
  getLoginUseCase,
  getSignUpUseCase,
  getSendPasswordResetUseCase,
  getGetUserPreferencesUseCase,
  getSetUserPreferencesUseCase,
  getListTasksUseCase,
  getCreateTaskUseCase,
  getUpdateTaskUseCase,
  getMoveTaskUseCase,
  getRemoveTaskUseCase,
} from '../container';
import type { IAuthRepository } from '../../domain/contracts/repositories/IAuthRepository';
import type { LoginUseCase } from '../../domain/use-cases/auth/LoginUseCase';
import type { SignUpUseCase } from '../../domain/use-cases/auth/SignUpUseCase';
import type { SendPasswordResetUseCase } from '../../domain/use-cases/auth/SendPasswordResetUseCase';
import type { GetUserPreferencesUseCase } from '../../domain/use-cases/preferences/GetUserPreferencesUseCase';
import type { SetUserPreferencesUseCase } from '../../domain/use-cases/preferences/SetUserPreferencesUseCase';
import type { ListTasksUseCase } from '../../domain/use-cases/tasks/ListTasksUseCase';
import type { CreateTaskUseCase } from '../../domain/use-cases/tasks/CreateTaskUseCase';
import type { UpdateTaskUseCase } from '../../domain/use-cases/tasks/UpdateTaskUseCase';
import type { MoveTaskUseCase } from '../../domain/use-cases/tasks/MoveTaskUseCase';
import type { RemoveTaskUseCase } from '../../domain/use-cases/tasks/RemoveTaskUseCase';

type ServicesContextValue = {
  authRepository: IAuthRepository;
  loginUseCase: LoginUseCase;
  signUpUseCase: SignUpUseCase;
  sendPasswordResetUseCase: SendPasswordResetUseCase;
  getUserPreferencesUseCase: GetUserPreferencesUseCase;
  setUserPreferencesUseCase: SetUserPreferencesUseCase;
  listTasksUseCase: ListTasksUseCase;
  createTaskUseCase: CreateTaskUseCase;
  updateTaskUseCase: UpdateTaskUseCase;
  moveTaskUseCase: MoveTaskUseCase;
  removeTaskUseCase: RemoveTaskUseCase;
};

const ServicesContext = createContext<ServicesContextValue | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initContainer();
  }, []);

  const value = useMemo<ServicesContextValue>(() => {
    const auth = getAuthRepository();
    return {
      authRepository: auth,
      loginUseCase: getLoginUseCase(),
      signUpUseCase: getSignUpUseCase(),
      sendPasswordResetUseCase: getSendPasswordResetUseCase(),
      getUserPreferencesUseCase: getGetUserPreferencesUseCase(),
      setUserPreferencesUseCase: getSetUserPreferencesUseCase(),
      listTasksUseCase: getListTasksUseCase(),
      createTaskUseCase: getCreateTaskUseCase(),
      updateTaskUseCase: getUpdateTaskUseCase(),
      moveTaskUseCase: getMoveTaskUseCase(),
      removeTaskUseCase: getRemoveTaskUseCase(),
    };
  }, []);

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices(): ServicesContextValue {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return ctx;
}
