import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import { Checkbox } from '../Checkbox';
import type { Task } from '../../../domain/entities/Task';
import type { Theme } from '../../../shared/theme';

type TaskCardProps = {
  task: Task;
  onPress: (task: Task) => void;
  onQuickAction?: (task: Task, action: 'moveDone' | 'startFocus' | 'stopFocus') => void;
  onChecklistChange?: (task: Task, itemId: string, done: boolean) => void;
};

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

function isFocusRunning(task: Task): boolean {
  return task.focusTimerStartedAt != null && task.focusTimerPausedAt == null;
}

export function TaskCard({ task, onPress, onQuickAction, onChecklistChange }: TaskCardProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const focusElapsed = getFocusElapsed(task);
  const focusRunning = isFocusRunning(task);
  const hasFocusElapsed = focusElapsed > 0;
  const showRetomar = hasFocusElapsed && !focusRunning;
  const checklistTotal = task.checklist?.length ?? 0;
  const checklistDone = task.checklist?.filter((c) => c.done).length ?? 0;
  const isDoing = task.status === 'doing';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(task)}
      accessibilityRole="button"
      accessibilityLabel={`Tarefa: ${task.title}. Toque para ver ações.`}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        {(task.points ?? 0) > 0 && (
          <Text style={styles.points}>{task.points} pts</Text>
        )}
        {focusElapsed > 0 && (
          <Text style={styles.focusTime}>⏱ {formatFocusTime(focusElapsed)}</Text>
        )}
        {checklistTotal > 0 && (
          <Text style={styles.checklistSummary}>
            Checklist: {checklistDone}/{checklistTotal}
          </Text>
        )}
        {checklistTotal > 0 && (
          <View style={styles.checklistList}>
            {task.checklist!.map((item) => (
              <Checkbox
                key={item.id}
                value={item.done}
                onValueChange={(done) => onChecklistChange?.(task, item.id, done)}
                label={item.label}
                containerStyle={styles.checklistItemWrap}
                disabled={!isDoing}
              />
            ))}
          </View>
        )}
        <View style={styles.quickActions}>
          {task.status === 'doing' && onQuickAction && (
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => onQuickAction(task, 'moveDone')}
              accessibilityLabel="Marcar como feito"
            >
              <Text style={styles.quickButtonText}>Finalizar</Text>
            </TouchableOpacity>
          )}
          {isDoing && onQuickAction && focusRunning && (
            <TouchableOpacity
              style={[styles.quickButton, styles.quickButtonSecondary]}
              onPress={() => onQuickAction(task, 'stopFocus')}
              accessibilityLabel="Finalizar foco"
            >
              <Text style={[styles.quickButtonText, styles.quickButtonTextSecondary]}>
                Finalizar foco
              </Text>
            </TouchableOpacity>
          )}
          {isDoing && onQuickAction && !focusRunning && (
            <TouchableOpacity
              style={[styles.quickButton, styles.quickButtonSecondary]}
              onPress={() => onQuickAction(task, 'startFocus')}
              accessibilityLabel={showRetomar ? 'Retomar foco' : 'Iniciar foco'}
            >
              <Text style={[styles.quickButtonText, styles.quickButtonTextSecondary]}>
                {showRetomar ? 'Retomar' : 'Iniciar foco'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      minHeight: 72,
    },
    cardPressed: {
      opacity: 0.9,
    },
    content: {
      gap: theme.spacing.xs,
    },
    title: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
    },
    description: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    points: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.textSecondary,
    },
    focusTime: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.primary,
    },
    checklistSummary: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.textSecondary,
    },
    checklistList: {
      marginTop: theme.spacing.xs,
    },
    checklistItemWrap: {
      marginBottom: theme.spacing.xs,
    },
    quickActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    quickButton: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
    quickButtonSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quickButtonText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.white,
    },
    quickButtonTextSecondary: {
      color: theme.colors.primary,
    },
  });
}
