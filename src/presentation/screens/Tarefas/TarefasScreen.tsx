import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { TarefasStackScreenProps } from '../../../app/navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { TaskSection } from '../../components/TaskSection';
import { EmptyTasksState } from '../../components/EmptyTasksState';
import { useThemeOptional, useServices } from '../../../app/providers';
import type { Task, TaskStatus } from '../../../domain/entities/Task';
import type { Theme } from '../../../shared/theme';
import type { GamificationState } from '../../../domain/entities/Gamification';

function sortByOrder(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

const TABS: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'A Fazer' },
  { key: 'doing', label: 'Fazendo' },
  { key: 'done', label: 'Feito' },
];



async function recalculateGamification(
  userId: string,
  listTasksUseCase: { execute: (userId: string) => Promise<Task[]> },
  getGamificationStateUseCase: { execute: (userId: string) => Promise<GamificationState> },
  saveGamificationStateUseCase: { execute: (userId: string, state: GamificationState) => Promise<void> }
): Promise<void> {
  const latestTasks = await listTasksUseCase.execute(userId);
  const currentGamification = await getGamificationStateUseCase.execute(userId);
  await saveGamificationStateUseCase.execute(
    userId,
    buildGamificationState(latestTasks, currentGamification)
  );
}

function buildGamificationState(tasks: Task[], current: GamificationState): GamificationState {
  const completedTasks = tasks.filter((task) => task.status === 'done');
  const completedTaskIds = completedTasks.map((task) => task.id);
  const pointsTotalEarned = completedTasks.reduce((sum, task) => sum + (task.points ?? 0), 0);
  return {
    ...current,
    completedTaskIds,
    pointsTotalEarned,
    pointsBalance: pointsTotalEarned - current.pointsSpent,
  };
}

export function TarefasScreen() {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    authRepository,
    listTasksUseCase,
    updateTaskUseCase,
    moveTaskUseCase,
    getGamificationStateUseCase,
    saveGamificationStateUseCase,
  } = useServices();

  const userId = authRepository.getCurrentUser()?.id ?? null;
  const navigation = useNavigation<TarefasStackScreenProps<'TarefasList'>['navigation']>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TaskStatus>('todo');
  const [timerTick, setTimerTick] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState('Atualizando tarefa…');

  const hasAnyFocusRunning = useMemo(
    () => tasks.some((t) => t.focusTimerStartedAt != null && t.focusTimerPausedAt == null),
    [tasks]
  );
  useEffect(() => {
    if (!hasAnyFocusRunning) return;
    const id = setInterval(() => setTimerTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [hasAnyFocusRunning]);

  const loadTasks = useCallback(async (silent = false) => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const list = await listTasksUseCase.execute(userId);
      setTasks(list);
      const currentGamification = await getGamificationStateUseCase.execute(userId);
      const nextGamification = buildGamificationState(list, currentGamification);
      if (JSON.stringify(nextGamification) !== JSON.stringify(currentGamification)) {
        await saveGamificationStateUseCase.execute(userId, nextGamification);
      }
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : 'Erro ao carregar tarefas');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [userId, listTasksUseCase, getGamificationStateUseCase, saveGamificationStateUseCase]);

  useFocusEffect(
    useCallback(() => {
      void loadTasks();
    }, [loadTasks])
  );

  const grouped = useMemo(() => {
    const todo = sortByOrder(tasks.filter((t) => t.status === 'todo'));
    const doing = sortByOrder(tasks.filter((t) => t.status === 'doing'));
    const done = sortByOrder(tasks.filter((t) => t.status === 'done'));
    return { todo, doing, done };
  }, [tasks]);

  const handleTaskPress = useCallback(
    (task: Task) => {
      navigation.navigate('TaskDetail', { task });
    },
    [navigation]
  );

  const handleQuickAction = useCallback(
    async (task: Task, action: 'moveDone' | 'startFocus' | 'stopFocus') => {
      if (!userId) return;
      try {
        if (action === 'moveDone') {
          setSavingMessage('Movendo para Feito…');
          setSaving(true);
          const now = new Date().toISOString();
          const finalizeFocus =
            task.focusTimerStartedAt != null && task.focusTimerPausedAt == null
              ? { focusTimerPausedAt: Date.now() }
              : {};
          const updated = {
            ...task,
            status: 'done' as const,
            completedAtISO: task.completedAtISO ?? now,
            updatedAtISO: now,
            ...finalizeFocus,
          };
          const nextTasks = tasks.map((t) => (t.id === task.id ? updated : t));
          setTasks(nextTasks);
          await updateTaskUseCase.execute(userId, updated);
          await recalculateGamification(userId, listTasksUseCase, getGamificationStateUseCase, saveGamificationStateUseCase);
        } else if (action === 'stopFocus') {
          setSavingMessage('Pausando foco…');
          setSaving(true);
          const now = Date.now();
          const updated = {
            ...task,
            focusTimerPausedAt: now,
            updatedAtISO: new Date().toISOString(),
          };
          const nextTasks = tasks.map((t) => (t.id === task.id ? updated : t));
          setTasks(nextTasks);
          await updateTaskUseCase.execute(userId, updated);
          await recalculateGamification(userId, listTasksUseCase, getGamificationStateUseCase, saveGamificationStateUseCase);
        } else {
          setSavingMessage(task.focusTimerStartedAt != null ? 'Retomando foco…' : 'Iniciando foco…');
          setSaving(true);
          const isResume = task.focusTimerPausedAt != null && task.focusTimerStartedAt != null;
          const elapsedMs = isResume
            ? task.focusTimerPausedAt! - task.focusTimerStartedAt!
            : 0;
          const newStartedAt = isResume ? Date.now() - elapsedMs : Date.now();
          const updatedTask = {
            ...task,
            status: 'doing' as const,
            focusTimerStartedAt: newStartedAt,
            focusTimerPausedAt: undefined,
            updatedAtISO: new Date().toISOString(),
          };
          setTasks((prev) =>
            prev.map((t) => {
              if (t.id === task.id) return updatedTask;
              if (t.focusTimerStartedAt != null)
                return {
                  ...t,
                  focusTimerStartedAt: undefined,
                  focusTimerPausedAt: undefined,
                  updatedAtISO: new Date().toISOString(),
                };
              return t;
            })
          );
          const others = tasks.filter((t) => t.id !== task.id && t.focusTimerStartedAt != null);
          for (const t of others) {
            await updateTaskUseCase.execute(userId, {
              ...t,
              focusTimerStartedAt: undefined,
              focusTimerPausedAt: undefined,
              updatedAtISO: new Date().toISOString(),
            });
          }
          await updateTaskUseCase.execute(userId, updatedTask);
          if (task.status === 'todo') setSelectedTab('doing');
        }
      } catch (e) {
        void loadTasks(true);
        Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao executar');
      } finally {
        setSaving(false);
      }
    },
    [userId, moveTaskUseCase, updateTaskUseCase, tasks, loadTasks, getGamificationStateUseCase, saveGamificationStateUseCase, listTasksUseCase]
  );

  const handleChecklistChange = useCallback(
    async (task: Task, itemId: string, done: boolean) => {
      if (!userId) return;
      const nextChecklist = (task.checklist ?? []).map((c) =>
        c.id === itemId ? { ...c, done } : c
      );
      const updatedTask = {
        ...task,
        checklist: nextChecklist,
        updatedAtISO: new Date().toISOString(),
      };
      try {
        setSavingMessage('Atualizando checklist…');
        setSaving(true);
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? updatedTask : t))
        );
        await updateTaskUseCase.execute(userId, updatedTask);
      } catch (e) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? task : t))
        );
        Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao atualizar');
      } finally {
        setSaving(false);
      }
    },
    [userId, updateTaskUseCase]
  );

  const handleOpenCreate = useCallback(() => {
    navigation.navigate('TaskEdit', {});
  }, [navigation]);

  if (!userId) {
    return (
      <ScreenContainer>
        <LoadingOverlay visible={saving} message={savingMessage} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Faça login para ver suas tarefas.</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingOverlay visible={saving} message={savingMessage} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando tarefas…</Text>
        </View>
      </ScreenContainer>
    );
  }

  const hasTasks = tasks.length > 0;

  return (
    <ScreenContainer>
      <LoadingOverlay visible={saving} message={savingMessage} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Tarefas</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleOpenCreate}
              accessibilityLabel="Criar tarefa"
            >
              <Text style={styles.addButtonText}>+ Criar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Toque em uma tarefa para mover, iniciar foco ou ver o checklist.
          </Text>
        </View>

        <View style={styles.tabRow}>
          {TABS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.tab, selectedTab === key && styles.tabActive]}
              onPress={() => setSelectedTab(key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: selectedTab === key }}
              accessibilityLabel={label}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === key && styles.tabTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? (
          <View style={styles.errorBlock}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!hasTasks ? (
          <EmptyTasksState />
        ) : (
          <TaskSection
            tasks={grouped[selectedTab]}
            onTaskPress={handleTaskPress}
            onQuickAction={handleQuickAction}
            onChecklistChange={handleChecklistChange}
            refreshTick={timerTick}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    content: { paddingBottom: theme.spacing.xxl },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.title,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    tabRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      alignItems: 'center',
      borderRadius: 8,
    },
    tabActive: {
      backgroundColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    tabText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.textSecondary,
    },
    tabTextActive: {
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.semibold,
    },
    errorBlock: {
      padding: theme.spacing.md,
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      borderRadius: 12,
      marginBottom: theme.spacing.md,
    },
    errorText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.error,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    addButton: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
    },
    addButtonText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.white,
    },
  });
}
