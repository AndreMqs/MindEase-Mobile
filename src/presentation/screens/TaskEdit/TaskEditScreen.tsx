import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { TarefasStackScreenProps } from '../../../app/navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input, Button, Checkbox } from '../../components';
import { useThemeOptional, useServices } from '../../../app/providers';
import type { Task, ChecklistItem } from '../../../domain/entities/Task';
import type { Theme } from '../../../shared/theme';

type RouteParams = TarefasStackScreenProps<'TaskEdit'>['route']['params'];

const defaultTask: Task = {
  id: '',
  title: '',
  description: '',
  status: 'todo',
  checklist: [],
  points: 10,
  createdAtISO: '',
  updatedAtISO: '',
  order: 0,
  boardId: 'default',
};

export function TaskEditScreen() {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute<RouteProp<import('../../../app/navigation/types').TarefasStackParamList, 'TaskEdit'>>();
  const navigation = useNavigation<TarefasStackScreenProps<'TaskEdit'>['navigation']>();
  const { authRepository, updateTaskUseCase, createTaskUseCase } = useServices();

  const task = route.params?.task ?? null;
  const isCreate = task == null;
  const editingTask = task ?? defaultTask;
  const userId = authRepository.getCurrentUser()?.id ?? null;

  const [title, setTitle] = useState(editingTask.title);
  const [description, setDescription] = useState(editingTask.description ?? '');
  const [points, setPoints] = useState(String(editingTask.points ?? 10));
  const [checklist, setChecklist] = useState<ChecklistItem[]>(editingTask.checklist ?? []);
  const [checklistDraft, setChecklistDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPoints(String(task.points ?? 10));
      setChecklist(task.checklist ?? []);
    }
  }, [task]);

  const handleSave = async () => {
    if (!userId) return;
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 2) {
      Alert.alert('Título muito curto', 'Use pelo menos 2 caracteres.');
      return;
    }
    const pointsNum = Math.max(1, Math.min(999, Number(points) || 10));
    setSaving(true);
    try {
      if (isCreate) {
        await createTaskUseCase.execute(userId, {
          title: trimmedTitle,
          description: description.trim() || undefined,
          points: pointsNum,
          checklist: checklist.length ? checklist.map((c) => ({ label: c.label })) : undefined,
        });
        navigation.navigate('TarefasList');
      } else {
        const updatedTask = await updateTaskUseCase.execute(userId, {
          ...task,
          title: trimmedTitle,
          description: description.trim() || undefined,
          points: pointsNum,
          checklist,
          updatedAtISO: new Date().toISOString(),
        });
        navigation.navigate('TaskDetail', { task: updatedTask });
      }
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao salvar');
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

  return (
    <ScreenContainer>
      <ScreenHeader
        title={isCreate ? 'Nova tarefa' : 'Editar tarefa'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
              <View style={styles.checklistItemContent}>
                <Checkbox
                  value={item.done}
                  onValueChange={(done) => handleChecklistToggle(item.id, done)}
                  label={item.label}
                  containerStyle={styles.checklistItemWrap}
                />
              </View>
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

        <View style={styles.footer}>
          <Button
            title="Cancelar"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.footerBtn}
          />
          <Button
            title={isCreate ? 'Criar' : 'Salvar'}
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.footerBtn}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    content: { paddingBottom: theme.spacing.xxl },
    checklistSection: { marginTop: theme.spacing.md, marginBottom: theme.spacing.lg },
    sectionLabel: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    checklistRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    checklistItemContent: {
      flex: 1,
      minWidth: 0,
    },
    checklistItemWrap: { marginBottom: 0, flex: 1, minWidth: 0 },
    removeItem: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm },
    removeItemText: { fontSize: theme.fontSizes.xs, color: theme.colors.error },
    checklistAddRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    checklistInputWrap: { flex: 1, marginBottom: 0 },
    addItemBtn: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addItemBtnDisabled: { opacity: 0.5 },
    addItemBtnText: {
      fontSize: theme.fontSizes.xl,
      color: theme.colors.white,
      fontWeight: theme.fontWeights.bold,
    },
    footer: { flexDirection: 'row', gap: theme.spacing.sm },
    footerBtn: { flex: 1 },
  });
}
