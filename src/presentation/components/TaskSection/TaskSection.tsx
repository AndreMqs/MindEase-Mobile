import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import { TaskCard } from '../TaskCard';
import type { Task } from '../../../domain/entities/Task';
import type { Theme } from '../../../shared/theme';

type TaskSectionProps = {
  title?: string;
  tasks: Task[];
  refreshTick?: number;
  onTaskPress: (task: Task) => void;
  onQuickAction?: (task: Task, action: 'moveDone' | 'startFocus' | 'stopFocus') => void;
  onChecklistChange?: (task: Task, itemId: string, done: boolean) => void;
};

export function TaskSection({ title, tasks, refreshTick = 0, onTaskPress, onQuickAction, onChecklistChange }: TaskSectionProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {tasks.length === 0 ? (
        <Text style={styles.empty}>Nenhuma tarefa</Text>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            refreshTick={refreshTick}
            onPress={onTaskPress}
            onQuickAction={onQuickAction}
            onChecklistChange={onChecklistChange}
          />
        ))
      )}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    empty: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: theme.spacing.sm,
    },
  });
}
