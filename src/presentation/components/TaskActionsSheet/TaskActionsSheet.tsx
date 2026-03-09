import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import { Checkbox } from '../Checkbox';
import type { Task, TaskStatus } from '../../../domain/entities/Task';
import type { Theme } from '../../../shared/theme';

export type TaskAction =
  | 'start'
  | 'moveDoing'
  | 'moveDone'
  | 'viewChecklist'
  | 'viewDetails'
  | 'startFocus'
  | 'stopFocus'
  | 'reopen'
  | 'remove';

type TaskActionsSheetProps = {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onAction: (task: Task, action: TaskAction) => void;
  onChecklistChange?: (task: Task, itemId: string, done: boolean) => void;
};

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

export function TaskActionsSheet({ visible, task, onClose, onAction, onChecklistChange }: TaskActionsSheetProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const baseActions = task ? getActionsForStatus(task.status) : [];
  const focusAction =
    task?.status === 'doing'
      ? (() => {
          const running = task.focusTimerStartedAt != null && task.focusTimerPausedAt == null;
          const hadFocus = task.focusTimerStartedAt != null;
          if (running) return { action: 'stopFocus' as const, label: 'Finalizar foco' };
          if (hadFocus) return { action: 'startFocus' as const, label: 'Retomar foco' };
          return { action: 'startFocus' as const, label: 'Iniciar foco' };
        })()
      : null;
  const actions = focusAction ? [...baseActions, focusAction] : baseActions;
  const withRemove = task ? [...actions, { action: 'remove' as const, label: 'Excluir tarefa' }] : [];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {task ? (
            <>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.title} numberOfLines={3}>
                  {task.title}
                </Text>
                {task.description ? (
                  <Text style={styles.description} numberOfLines={4}>
                    {task.description}
                  </Text>
                ) : null}
                <View style={styles.metaRow}>
                  <Text style={styles.points}>{task.points ?? 0} pts</Text>
                </View>
                {task.checklist && task.checklist.length > 0 ? (
                  <View style={styles.checklistBlock}>
                    <Text style={styles.checklistLabel}>Checklist</Text>
                    {task.checklist.map((item) => (
                      <Checkbox
                        key={item.id}
                        value={item.done}
                        onValueChange={(done) => onChecklistChange?.(task, item.id, done)}
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
                  onPress={() => {
                    onAction(task, action);
                    if (action !== 'viewDetails') onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                >
                  <Text
                    style={[
                      styles.optionText,
                      action === 'remove' && styles.optionTextDanger,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
              </ScrollView>
            </>
          ) : null}
          <Pressable
            style={({ pressed }) => [styles.cancel, pressed && styles.optionPressed]}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
      maxHeight: '85%',
    },
    scroll: {
      maxHeight: 400,
    },
    scrollContent: {
      paddingBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    description: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      lineHeight: 20,
    },
    metaRow: {
      marginBottom: theme.spacing.sm,
    },
    points: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    checklistBlock: {
      marginBottom: theme.spacing.md,
    },
    checklistLabel: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    checklistItemWrap: {
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    option: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: 12,
      marginBottom: theme.spacing.xs,
    },
    optionPressed: {
      backgroundColor: theme.colors.menuSelected,
    },
    optionText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.medium,
    },
    optionTextDanger: {
      color: theme.colors.error,
    },
    cancel: {
      paddingVertical: theme.spacing.md,
      marginTop: theme.spacing.sm,
      alignItems: 'center',
    },
    cancelText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
    },
  });
}
