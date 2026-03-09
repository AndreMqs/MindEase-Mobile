import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { ScreenContainer, PanelSelect, Button } from '../../components';
import { useThemeOptional, useServices, usePreferences } from '../../../app/providers';
import { consumePanelWelcomeModal } from '../../../app/panelWelcome';
import type { Preferences, ComplexityLevel, ContrastLevel } from '../../../domain/entities/Preferences';
import { defaultPreferences } from '../../../domain/entities/Preferences';
import type { Theme } from '../../../shared/theme';

const WELCOME_TOPICS = [
  'Complexidade da interface — simples, padrão ou detalhado',
  'Modo Foco — reduz distrações na tela',
  'Modo Resumo — exibe só o essencial',
  'Animações — ligar ou desligar transições',
  'Contraste — normal, alto ou muito alto',
  'Tamanho da fonte — em todo o app',
  'Espaçamento — entre botões e textos',
  'Alertas cognitivos — lembretes de pausa',
];

const COMPLEXITY_OPTIONS: { value: ComplexityLevel; label: string }[] = [
  { value: 'simple', label: 'Simples — remove elementos secundários' },
  { value: 'standard', label: 'Padrão — interface normal' },
  { value: 'detailed', label: 'Detalhado — mostra mais contexto' },
];

const CONTRAST_OPTIONS: { value: ContrastLevel; label: string }[] = [
  { value: 'normal', label: 'Normal — tema atual' },
  { value: 'high', label: 'Alto — fundo mais escuro + texto mais claro' },
  { value: 'veryHigh', label: 'Muito alto — preto puro + branco puro' },
];

const FONT_OPTIONS = [
  { value: '14', label: '14px — texto compacto' },
  { value: '16', label: '16px — padrão' },
  { value: '18', label: '18px — acessível' },
  { value: '20', label: '20px — baixa visão / UI expandida' },
];

const SPACING_OPTIONS = [
  { value: '6', label: 'Compacto — gap menor' },
  { value: '8', label: 'Padrão — atual' },
  { value: '10', label: 'Confortável' },
  { value: '12', label: 'Amplo — mais respiro (recomendado para dislexia e TDAH)' },
];

export function PainelScreen() {
  const theme = useThemeOptional();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { authRepository } = useServices();
  const { preferences, loading, error, patch: contextPatch, reset: contextReset } = usePreferences();
  const [saving, setSaving] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const userId = authRepository.getCurrentUser()?.id ?? null;

  useEffect(() => {
    if (userId && !loading && consumePanelWelcomeModal()) {
      setShowWelcomeModal(true);
    }
  }, [userId, loading]);

  const patch = async (partial: Partial<Preferences>) => {
    setSaving(true);
    try {
      await contextPatch(partial);
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    Alert.alert(
      'Restaurar padrões',
      'Todas as preferências voltarão ao padrão. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' as const },
        {
          text: 'Restaurar',
          onPress: async () => {
            setSaving(true);
            try {
              await contextReset();
            } catch (e) {
              Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao restaurar');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  if (!userId) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Faça login para configurar o painel.</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando preferências…</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <>
      <Modal visible={showWelcomeModal} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setShowWelcomeModal(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Personalize do seu jeito</Text>
            <Text style={styles.modalIntro}>
              Aqui você pode personalizar o app do jeito que preferir. Todas as opções abaixo estão neste painel.
            </Text>
            <View style={styles.modalList}>
              {WELCOME_TOPICS.map((item, i) => (
                <View key={i} style={styles.modalBulletRow}>
                  <Text style={styles.modalBullet}>•</Text>
                  <Text style={styles.modalBulletText}>{item}</Text>
                </View>
              ))}
            </View>
            <Button title="Entendi" onPress={() => setShowWelcomeModal(false)} style={styles.modalButton} />
          </Pressable>
        </Pressable>
      </Modal>
      <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Painel Cognitivo</Text>
          <Text style={styles.subtitle}>
            Ajuste a experiência para reduzir carga cognitiva (TDAH, TEA, dislexia, burnout, ansiedade).
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBlock}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.sectionCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Complexidade da interface</Text>
            <PanelSelect
            label="Controle"
            value={preferences.complexity}
            options={COMPLEXITY_OPTIONS}
            onChange={(v) => patch({ complexity: v })}
            disabled={saving}
          />
          <Text style={styles.hint}>
            {preferences.complexity === 'simple' && 'Oculta elementos secundários. Interface mais limpa.'}
            {preferences.complexity === 'standard' && 'Nada ocultado. Interface atual.'}
            {preferences.complexity === 'detailed' && 'Exibe contadores, tooltips, metadados.'}
          </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Modo Foco</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {preferences.focusMode ? 'ON — Remove distrações' : 'OFF — Interface completa'}
            </Text>
            <Switch
              value={preferences.focusMode}
              onValueChange={(v) => patch({ focusMode: v })}
              disabled={saving}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
          <Text style={styles.hint}>
            {preferences.focusMode
              ? 'Esconde pontos, gamificação, filtros. Ficam apenas Tarefas e Kanban.'
              : 'Mostra todos os elementos.'}
          </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Modo Resumo</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {preferences.summaryMode ? 'Resumo — só título' : 'Detalhado — título + descrição'}
            </Text>
            <Switch
              value={preferences.summaryMode}
              onValueChange={(v) => patch({ summaryMode: v })}
              disabled={saving}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
          <Text style={styles.hint}>
            {preferences.summaryMode ? 'Descrição das tarefas desaparece.' : 'Mostra título e descrição.'}
          </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Animações</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {preferences.animationsEnabled ? 'ON — Transições suaves' : 'OFF — Sem animações'}
            </Text>
            <Switch
              value={preferences.animationsEnabled}
              onValueChange={(v) => patch({ animationsEnabled: v })}
              disabled={saving}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
          <Text style={styles.hint}>
            {preferences.animationsEnabled
              ? 'Drag & drop com animação.'
              : 'Movimentação instantânea. Quem tem sensibilidade vestibular pode preferir OFF.'}
          </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Contraste</Text>
          <PanelSelect
            label="Controle"
            value={preferences.contrast}
            options={CONTRAST_OPTIONS}
            onChange={(v) => patch({ contrast: v })}
            disabled={saving}
          />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Tamanho da fonte</Text>
          <PanelSelect
            label="Controle"
            value={String(preferences.fontSizePx)}
            options={FONT_OPTIONS}
            onChange={(v) => patch({ fontSizePx: Number(v) })}
            disabled={saving}
          />
          <Text style={styles.hint}>Usado em todo o app para melhor leitura.</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Espaçamento</Text>
          <PanelSelect
            label="Controle"
            value={String(preferences.spacingPx)}
            options={SPACING_OPTIONS}
            onChange={(v) => patch({ spacingPx: Number(v) })}
            disabled={saving}
          />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Alertas cognitivos</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {preferences.cognitiveAlertsEnabled ? 'Ativados' : 'Desativados'}
            </Text>
            <Switch
              value={preferences.cognitiveAlertsEnabled}
              onValueChange={(v) => patch({ cognitiveAlertsEnabled: v })}
              disabled={saving}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
          <Text style={styles.hint}>
            15 min na mesma tarefa → aviso. 30 min → sugestão de pausa. 45 min → alerta.
          </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={reset} disabled={saving} style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restaurar padrões</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
    </>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl },
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
      lineHeight: 22,
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
    sectionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    section: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.xs,
    },
    switchLabel: {
      flex: 1,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    hint: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xs,
    },
    footer: {
      marginTop: theme.spacing.lg,
      alignItems: 'center',
    },
    restoreButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
    restoreText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.semibold,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    modalCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      maxWidth: 400,
      width: '100%',
    },
    modalTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    modalIntro: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      marginBottom: theme.spacing.lg,
    },
    modalList: {
      marginBottom: theme.spacing.xl,
    },
    modalBulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    modalBullet: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      marginRight: theme.spacing.sm,
    },
    modalBulletText: {
      flex: 1,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      lineHeight: 20,
    },
    modalButton: {
      width: '100%',
    },
  });
}
