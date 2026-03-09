import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useServices } from './ServicesProvider';
import type { Preferences } from '../../domain/entities/Preferences';
import { defaultPreferences } from '../../domain/entities/Preferences';

type PreferencesContextValue = {
  preferences: Preferences;
  loading: boolean;
  error: string | null;
  patch: (partial: Partial<Preferences>) => Promise<void>;
  reset: () => Promise<void>;
  refresh: () => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { authRepository, getUserPreferencesUseCase, setUserPreferencesUseCase } = useServices();
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const prefs = await getUserPreferencesUseCase.execute(userId);
        setPreferences(prefs);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Falha ao carregar preferências');
        setPreferences(defaultPreferences);
      } finally {
        setLoading(false);
      }
    },
    [getUserPreferencesUseCase]
  );

  useEffect(() => {
    const unsubscribe = authRepository.subscribeAuthState((user) => {
      const userId = user?.id ?? null;
      if (!userId) {
        setPreferences(defaultPreferences);
        setLoading(false);
        setError(null);
      } else {
        load(userId);
      }
    });
    return unsubscribe;
  }, [authRepository, load]);

  const refresh = useCallback(async () => {
    const userId = authRepository.getCurrentUser()?.id ?? null;
    if (userId) await load(userId);
  }, [authRepository, load]);

  const patch = useCallback(
    async (partial: Partial<Preferences>) => {
      const userId = authRepository.getCurrentUser()?.id ?? null;
      if (!userId) return;
      const next = { ...preferences, ...partial };
      setPreferences(next);
      try {
        await setUserPreferencesUseCase.execute(userId, next);
      } catch (e) {
        setPreferences(preferences);
        throw e;
      }
    },
    [authRepository, preferences, setUserPreferencesUseCase]
  );

  const reset = useCallback(async () => {
    const userId = authRepository.getCurrentUser()?.id ?? null;
    if (!userId) return;
    setPreferences(defaultPreferences);
    try {
      await setUserPreferencesUseCase.execute(userId, defaultPreferences);
    } catch (e) {
      throw e;
    }
  }, [authRepository, setUserPreferencesUseCase]);

  const value: PreferencesContextValue = {
    preferences,
    loading,
    error,
    patch,
    reset,
    refresh,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
}
