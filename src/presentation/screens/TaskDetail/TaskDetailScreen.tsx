import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { TarefasStackScreenProps } from '../../../app/navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Checkbox } from '../../components/Checkbox';
import { useThemeOptional, useServices } from '../../../app/providers';
import type { Task, TaskStatus } from '../../../domain/entities/Task';
import type { TaskAction } from '../../components/TaskActionsSheet';
import type { Theme } from '../../../shared/theme';

type RouteParams = TarefasStackScreenProps<'TaskDetail'>['route']['params'];

function getFocusElapsedSafe(task: Task): number {
  if (task.focusTimerStartedAt == null) return 0;
  const end = task.focusTimerPausedAt ?? Date.now();
  return Math.floor((end - task.focusTimerStartedAt) / 1000);
}

function getActionsForStatus(status: TaskStatus): { action: TaskAction; label: string }[] {
  switch (status) {
    case 'todo':
      return [
        { action: 'viewDetails', label: 'Editar' },
        { action: 'moveDoing', label: 'Mover para Fazendo' },
      ];
    case 'doing':
      return [
        { action: 'viewDetails', label: 'Editar' },
        { action: 'start', label: 'Começar tarefa' },
        { action: 'moveDone', label: 'Marcar como Feito' },
      ];
    case 'done':
      return [
        { action: 'viewDetails', label: 'Editar' },
        { action: 'reopen', label: 'Reabrir (mover para Fazendo)' },
      ];
    default:
      return [];
  }
}

function getFocusAction(task: Task): { action: 'startFocus' | 'stopFocus'; label: string } | null {
  if (task.status !== 'doing') return null;
  const running = task.focusTimerStartedAt != null && task.focusTimerPausedAt == null;
  const hadFocus = task.focusTimerStartedAt != null;
  if (running) return { action: 'stopFocus', label: 'Finalizar foco' };
  if (hadFocus) return { action: 'startFocus', label: 'Retomar foco' };
  return { action: 'startFocus', label: 'Iniciar foco' };
}

function formatFocusTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getFocusElapsed(task: Task): number {
  if (task.focusTimerStartedAt == null) return 0;
  if (task.focusTimerPausedAt != null) {
    return Math.floor((task.focusTimerPausedAt - task.focusTimerStartedAt) / 1000);
  }
  return Math.floor((Date.now() - task.focusTimerStartedAt) / 1000);
}

export function TaskDetailScreen() {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute<RouteProp<import('../../../app/navigation/types').TarefasStackParamList, 'TaskDetail'>>();
  const navigation = useNavigation<TarefasStackScreenProps<'TaskDetail'>['navigation']>();
  const { authRepository, updateTaskUseCase, moveTaskUseCase, removeTaskUseCase } = useServices();

  const [task, setTask] = useState<Task>(route.params.task);
  const [timerTick, setTimerTick] = useState(0);
  const userId = authRepository.getCurrentUser()?.id ?? null;

  const focusRunning = task.focusTimerStartedAt != null && task.focusTimerPausedAt == null;
  const focusElapsed = getFocusElapsedSafe(task);

  useEffect(() => {
    setTask(route.params.task);
  }, [route.params.task]);

  useEffect(() => {
    if (!focusRunning) return;
    const id = setInterval(() => setTimerTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [focusRunning]);

  const handleChecklistChange = useCallback(
    async (itemId: string, done: boolean) => {
      if (!userId) return;
      const nextChecklist = (task.checklist ?? []).map((c) =>
        c.id === itemId ? { ...c, done } : c
      );
      const updated = { ...task, checklist: nextChecklist, updatedAtISO: new Date().toISOString() };
      setTask(updated);
      try {
        await updateTaskUseCase.execute(userId, updated);
      } catch (e) {
        Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao atualizar');
      }
    },
    [userId, task, updateTaskUseCase]
  );

  const handleAction = useCallback(
    async (action: TaskAction) => {
      if (!userId) return;
      if (action === 'viewDetails') {
        navigation.navigate('TaskEdit', { task });
        return;
      }
      try {
        if (action === 'remove') {
          Alert.alert(
            'Excluir tarefa',
            `Excluir "${task.title}"?`,
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                  await removeTaskUseCase.execute(userId, task.id);
                  navigation.goBack();
                },
              },
            ]
          );
          return;
        }
        if (action === 'start' || action === 'moveDoing') {
          await moveTaskUseCase.execute(userId, task.id, 'doing');
        } else if (action === 'moveDone') {
          const now = Date.now();
          const finalizeFocus =
            task.focusTimerStartedAt != null && task.focusTimerPausedAt == null
              ? { focusTimerPausedAt: now }
              : {};
          await updateTaskUseCase.execute(userId, {
            ...task,
            status: 'done',
            completedAtISO: task.completedAtISO ?? new Date().toISOString(),
            updatedAtISO: new Date().toISOString(),
            ...finalizeFocus,
          });
        } else if (action === 'reopen') {
          await moveTaskUseCase.execute(userId, task.id, 'doing');
        } else if (action === 'startFocus') {
          const isResume = task.focusTimerPausedAt != null && task.focusTimerStartedAt != null;
          const elapsedMs = isResume && task.focusTimerPausedAt != null && task.focusTimerStartedAt != null
            ? task.focusTimerPausedAt - task.focusTimerStartedAt
            : 0;
          const newStartedAt = isResume ? Date.now() - elapsedMs : Date.now();
          await updateTaskUseCase.execute(userId, {
            ...task,
            status: 'doing',
            focusTimerStartedAt: newStartedAt,
            focusTimerPausedAt: undefined,
            updatedAtISO: new Date().toISOString(),
          });
          setTask((prev) => ({
            ...prev,
            focusTimerStartedAt: newStartedAt,
            focusTimerPausedAt: undefined,
            updatedAtISO: new Date().toISOString(),
          }));
          return;
        } else if (action === 'stopFocus') {
          const now = Date.now();
          await updateTaskUseCase.execute(userId, {
            ...task,
            focusTimerPausedAt: now,
            updatedAtISO: new Date().toISOString(),
          });
          setTask((prev) => ({ ...prev, focusTimerPausedAt: now, updatedAtISO: new Date().toISOString() }));
          return;
        }
        navigation.goBack();
      } catch (e) {
        Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao executar');
      }
    },
    [userId, task, moveTaskUseCase, updateTaskUseCase, removeTaskUseCase, navigation]
  );

  const baseActions = getActionsForStatus(task.status);
  const focusAction = getFocusAction(task);
  const actions = focusAction ? [...baseActions, focusAction] : baseActions;
  const withRemove = [...actions, { action: 'remove' as const, label: 'Excluir tarefa' }];

  return (
    <ScreenContainer>
      <ScreenHeader title="Detalhes" onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title} numberOfLines={3}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={6}>
            {task.description}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={styles.points}>{task.points ?? 0} pts</Text>
          {focusElapsed > 0 && (
            <Text style={styles.focusTime}>⏱ {formatFocusTime(focusElapsed)}</Text>
          )}
        </View>
        {task.checklist && task.checklist.length > 0 ? (
          <View style={styles.checklistBlock}>
            <Text style={styles.checklistLabel}>Checklist</Text>
            {task.checklist.map((item) => (
              <Checkbox
                key={item.id}
                value={item.done}
                onValueChange={(done) => handleChecklistChange(item.id, done)}
                label={item.label}
                containerStyle={styles.checklistItemWrap}
              />
            ))}
          </View>
        ) : null}
        <Text style={styles.subtitle}>Escolha uma ação</Text>
        {withRemove.map(({ action, label }) => (
          <Pressable
            key={action}
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={() => handleAction(action)}
          >
            <Text
              style={[styles.optionText, action === 'remove' && styles.optionTextDanger]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    content: { paddingBottom: theme.spacing.xxl },
    title: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    description: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      lineHeight: 22,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    points: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    focusTime: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
    },
    checklistBlock: { marginBottom: theme.spacing.lg },
    checklistLabel: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    checklistItemWrap: { marginBottom: theme.spacing.xs },
    subtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    option: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: 12,
      marginBottom: theme.spacing.xs,
    },
    optionPressed: { backgroundColor: theme.colors.menuSelected },
    optionText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.medium,
    },
    optionTextDanger: { color: theme.colors.error },
  });
}
