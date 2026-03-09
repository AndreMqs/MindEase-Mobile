import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useThemeOptional } from '../../../app/providers';
import { Input } from '../Input';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import type { Task, ChecklistItem } from '../../../domain/entities/Task';
import type { TaskAction } from '../TaskActionsSheet';
import type { Theme } from '../../../shared/theme';

type TaskDetailsModalProps = {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  onAction: (task: Task, action: TaskAction) => void;
};

function getActionsForStatus(status: Task['status']): { action: TaskAction; label: string }[] {
  switch (status) {
    case 'todo':
      return [
        { action: 'start', label: 'Começar tarefa' },
        { action: 'moveDoing', label: 'Mover para Fazendo' },
        { action: 'startFocus', label: 'Iniciar foco' },
      ];
    case 'doing':
      return [
        { action: 'moveDone', label: 'Marcar como Feito' },
        { action: 'startFocus', label: 'Iniciar foco' },
      ];
    case 'done':
      return [{ action: 'reopen', label: 'Reabrir (mover para Fazendo)' }];
    default:
      return [];
  }
}

export function TaskDetailsModal({
  visible,
  task,
  onClose,
  onSave,
  onAction,
}: TaskDetailsModalProps) {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [checklistDraft, setChecklistDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPoints(String(task.points ?? 10));
      setChecklist(task.checklist ?? []);
      setChecklistDraft('');
    }
  }, [task, visible]);

  const handleSave = async () => {
    if (!task) return;
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 2) {
      Alert.alert('Título muito curto', 'Use pelo menos 2 caracteres.');
      return;
    }
    const pointsNum = Math.max(1, Math.min(999, Number(points) || 10));
    setSaving(true);
    try {
      await onSave({
        ...task,
        title: trimmedTitle,
        description: description.trim() || undefined,
        points: pointsNum,
        checklist,
        updatedAtISO: new Date().toISOString(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleChecklistToggle = (itemId: string, done: boolean) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, done } : c))
    );
  };

  const handleAddChecklistItem = () => {
    const label = checklistDraft.trim();
    if (!label) return;
    setChecklist((prev) => [
      ...prev,
      { id: 'c_' + Date.now() + '_' + prev.length, label, done: false },
    ]);
    setChecklistDraft('');
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    setChecklist((prev) => prev.filter((c) => c.id !== itemId));
  };

  const actions = task ? getActionsForStatus(task.status) : [];

  if (!task) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.headerTitle}>Detalhes da tarefa</Text>

            <Input
              label="Nome"
              value={title}
              onChangeText={setTitle}
              placeholder="Título da tarefa"
            />
            <Input
              label="Descrição"
              value={description}
              onChangeText={setDescription}
              placeholder="Descrição (opcional)"
              multiline
            />
            <Input
              label="Pontos"
              value={points}
              onChangeText={setPoints}
              placeholder="10"
              keyboardType="number-pad"
            />

            <View style={styles.checklistSection}>
              <Text style={styles.sectionLabel}>Checklist</Text>
              {checklist.map((item) => (
                <View key={item.id} style={styles.checklistRow}>
                  <Checkbox
                    value={item.done}
                    onValueChange={(done) => handleChecklistToggle(item.id, done)}
                    label={item.label}
                    containerStyle={styles.checklistItemWrap}
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveChecklistItem(item.id)}
                    style={styles.removeItem}
                  >
                    <Text style={styles.removeItemText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.checklistAddRow}>
                <Input
                  placeholder="Nova etapa"
                  value={checklistDraft}
                  onChangeText={setChecklistDraft}
                  containerStyle={styles.checklistInputWrap}
                />
                <TouchableOpacity
                  style={[styles.addItemBtn, !checklistDraft.trim() && styles.addItemBtnDisabled]}
                  onPress={handleAddChecklistItem}
                  disabled={!checklistDraft.trim()}
                >
                  <Text style={styles.addItemBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionsSection}>
              <Text style={styles.sectionLabel}>Ações</Text>
              {actions.map(({ action, label }) => (
                <Pressable
                  key={action}
                  style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
                  onPress={() => onAction(task, action)}
                >
                  <Text style={styles.actionBtnText}>{label}</Text>
                </Pressable>
              ))}
              <Pressable
                style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
                onPress={() => onAction(task, 'remove')}
              >
                <Text style={styles.actionBtnTextDanger}>Remover tarefa</Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Button title="Cancelar" variant="outline" onPress={onClose} style={styles.footerBtn} />
              <Button
                title="Salvar"
                onPress={handleSave}
                loading={saving}
                disabled={saving}
                style={styles.footerBtn}
              />
            </View>
          </ScrollView>
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
    modal: {
      maxHeight: '90%',
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: theme.spacing.lg,
    },
    scroll: { maxHeight: '100%' },
    scrollContent: { paddingBottom: theme.spacing.xxl },
    headerTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    sectionLabel: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    checklistSection: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    checklistRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    checklistItemWrap: {
      flex: 1,
      marginBottom: 0,
    },
    removeItem: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    removeItemText: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.error,
    },
    checklistAddRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    checklistInputWrap: {
      flex: 1,
      marginBottom: 0,
    },
    addItemBtn: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addItemBtnDisabled: {
      opacity: 0.5,
    },
    addItemBtnText: {
      fontSize: theme.fontSizes.xl,
      color: theme.colors.white,
      fontWeight: theme.fontWeights.bold,
    },
    actionsSection: {
      marginBottom: theme.spacing.xl,
    },
    actionBtn: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: 12,
      marginBottom: theme.spacing.xs,
    },
    actionBtnPressed: {
      backgroundColor: theme.colors.menuSelected,
    },
    actionBtnText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.medium,
    },
    actionBtnTextDanger: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.error,
      fontWeight: theme.fontWeights.medium,
    },
    footer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    footerBtn: {
      flex: 1,
    },
  });
}
