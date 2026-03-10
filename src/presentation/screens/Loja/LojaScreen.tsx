import { doc, onSnapshot } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useServices, useThemeOptional } from '../../../app/providers';
import type { GamificationState, RewardItem } from '../../../domain/entities/Gamification';
import type { Task } from '../../../domain/entities/Task';
import { db } from '../../../lib/firebase';
import type { Theme } from '../../../shared/theme';
import { Button, Input, LoadingOverlay } from '../../components';
import { ScreenContainer } from '../../components/ScreenContainer';


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

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

export function LojaScreen() {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { authRepository, listTasksUseCase, getGamificationStateUseCase, saveGamificationStateUseCase } = useServices();
  const userId = authRepository.getCurrentUser()?.id ?? null;
  const [state, setState] = useState<GamificationState | null>(null);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('10');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingMessage, setSavingMessage] = useState('Atualizando loja…');

  const load = useCallback(async () => {
    if (!userId) {
      setState(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [currentGamification, tasks] = await Promise.all([
        getGamificationStateUseCase.execute(userId),
        listTasksUseCase.execute(userId),
      ]);
      const syncedGamification = buildGamificationState(tasks, currentGamification);
      if (JSON.stringify(syncedGamification) !== JSON.stringify(currentGamification)) {
        await saveGamificationStateUseCase.execute(userId, syncedGamification);
      }
      setState(syncedGamification);
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao carregar loja');
    } finally {
      setLoading(false);
    }
  }, [userId, getGamificationStateUseCase, listTasksUseCase, saveGamificationStateUseCase]);

  useEffect(() => {
    if (!userId) {
      setState(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const userRef = doc(db, 'users', userId);

    void load();

    const unsubscribe = onSnapshot(
      userRef,
      () => {
        if (!isMounted) return;
        void load();
      },
      (error) => {
        if (!isMounted) return;
        Alert.alert('Erro', error.message || 'Falha ao sincronizar loja');
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userId, load]);

  const persist = useCallback(async (next: GamificationState) => {
    if (!userId) return;
    setState(next);
    await saveGamificationStateUseCase.execute(userId, next);
  }, [userId, saveGamificationStateUseCase]);

  const handleCreateReward = useCallback(async () => {
    if (!state || !userId) return;
    const trimmed = title.trim();
    const parsedCost = Number(cost);
    if (trimmed.length < 2) {
      Alert.alert('Nome inválido', 'Use pelo menos 2 caracteres.');
      return;
    }
    if (!Number.isFinite(parsedCost) || parsedCost <= 0) {
      Alert.alert('Custo inválido', 'Informe um custo maior que zero.');
      return;
    }
    setSavingMessage('Criando prêmio…');
    setSaving(true);
    try {
      const reward: RewardItem = {
        id: 'r_' + Date.now(),
        title: trimmed,
        cost: Math.floor(parsedCost),
        createdAtISO: new Date().toISOString(),
      };
      const next = { ...state, rewards: [reward, ...state.rewards] };
      await persist(next);
      setTitle('');
      setCost('10');
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao criar prêmio');
    } finally {
      setSaving(false);
    }
  }, [state, userId, title, cost, persist]);

  const handleRedeem = useCallback((reward: RewardItem) => {
    if (!state || !userId) return;
    if (state.pointsBalance < reward.cost) {
      Alert.alert('Pontos insuficientes', 'Você não tem pontos suficientes para esse resgate.');
      return;
    }
    Alert.alert(
      'Confirmar resgate',
      `Resgatar "${reward.title}" por ${reward.cost} pontos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resgatar',
          onPress: async () => {
            setSavingMessage('Resgatando recompensa…');
            setSaving(true);
            try {
              const next = {
                ...state,
                pointsSpent: state.pointsSpent + reward.cost,
                pointsBalance: state.pointsBalance - reward.cost,
                redemptionHistory: [
                  {
                    id: 'h_' + Date.now(),
                    rewardId: reward.id,
                    title: reward.title,
                    cost: reward.cost,
                    redeemedAtISO: new Date().toISOString(),
                  },
                  ...state.redemptionHistory,
                ],
              };
              await persist(next);
            } catch (e) {
              Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao resgatar prêmio');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  }, [state, userId, persist]);

  const handleDeleteReward = useCallback(async (rewardId: string) => {
    if (!state) return;
    setSavingMessage('Excluindo prêmio…');
    setSaving(true);
    try {
      const next = { ...state, rewards: state.rewards.filter((item) => item.id !== rewardId) };
      await persist(next);
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao excluir prêmio');
    } finally {
      setSaving(false);
    }
  }, [state, persist]);

  if (!userId) {
    return <ScreenContainer><View style={styles.centered}><Text style={styles.errorText}>Faça login para usar a loja.</Text></View></ScreenContainer>;
  }
  if (loading || !state) {
    return <ScreenContainer><View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View></ScreenContainer>;
  }

  return (
    <ScreenContainer>
      <LoadingOverlay visible={saving} message={savingMessage} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>Loja</Text>
          <Text style={styles.subtitle}>Crie recompensas e resgate usando seus pontos.</Text>
          <View style={styles.pointsChip}><Text style={styles.pointsChipText}>{state.pointsBalance} pts</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Novo prêmio</Text>
          <Input label="Nome" value={title} onChangeText={setTitle} placeholder="Ex.: Comer um doce" />
          <Input label="Custo" value={cost} onChangeText={setCost} keyboardType="number-pad" placeholder="10" />
          <Button title="Criar prêmio" onPress={handleCreateReward} loading={saving} disabled={saving} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Prêmios</Text>
          {state.rewards.length === 0 ? <Text style={styles.emptyText}>Nenhum prêmio cadastrado.</Text> : state.rewards.map((reward) => (
            <View key={reward.id} style={styles.rewardItem}>
              <View style={styles.rewardMeta}><Text style={styles.rewardTitle}>{reward.title}</Text><Text style={styles.rewardCost}>{reward.cost} pts</Text></View>
              <View style={styles.rewardActions}>
                <TouchableOpacity style={[styles.actionBtn, styles.buyBtn, state.pointsBalance < reward.cost && styles.actionBtnDisabled]} onPress={() => handleRedeem(reward)} disabled={saving || state.pointsBalance < reward.cost}><Text style={styles.buyBtnText}>Resgatar</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn, saving && styles.actionBtnDisabled]} onPress={() => handleDeleteReward(reward.id)} disabled={saving}><Text style={styles.deleteBtnText}>Excluir</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Histórico de resgates</Text>
          {state.redemptionHistory.length === 0 ? <Text style={styles.emptyText}>Nenhum resgate ainda.</Text> : state.redemptionHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Text style={styles.historyTitle}>{item.title}</Text>
              <Text style={styles.historyMeta}>-{item.cost} pts • {formatDate(item.redeemedAtISO)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    content: { paddingBottom: theme.spacing.xxl },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    errorText: { color: theme.colors.textSecondary },
    headerCard: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 20, padding: theme.spacing.lg, marginBottom: theme.spacing.lg },
    title: { fontSize: theme.fontSizes.xl, fontWeight: theme.fontWeights.bold, color: theme.colors.text, marginBottom: theme.spacing.xs },
    subtitle: { fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.md },
    pointsChip: { alignSelf: 'flex-start', backgroundColor: theme.colors.menuSelected, borderRadius: 999, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
    pointsChipText: { color: theme.colors.primary, fontWeight: theme.fontWeights.semibold },
    card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 20, padding: theme.spacing.lg, marginBottom: theme.spacing.lg },
    sectionTitle: { fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.semibold, color: theme.colors.text, marginBottom: theme.spacing.md },
    emptyText: { color: theme.colors.textSecondary },
    rewardItem: { paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    rewardMeta: { marginBottom: theme.spacing.sm },
    rewardTitle: { color: theme.colors.text, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.medium },
    rewardCost: { color: theme.colors.textSecondary, marginTop: 2 },
    rewardActions: { flexDirection: 'row', gap: theme.spacing.sm },
    actionBtn: { borderRadius: 12, paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
    actionBtnDisabled: { opacity: 0.5 },
    buyBtn: { backgroundColor: theme.colors.primary },
    buyBtnText: { color: theme.colors.buttonText, fontWeight: theme.fontWeights.semibold },
    deleteBtn: { backgroundColor: theme.colors.menuSelected },
    deleteBtnText: { color: theme.colors.error, fontWeight: theme.fontWeights.semibold },
    historyItem: { paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    historyTitle: { color: theme.colors.text, fontWeight: theme.fontWeights.medium },
    historyMeta: { color: theme.colors.textSecondary, marginTop: 2 },
  });
}
