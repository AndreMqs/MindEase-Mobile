/**
 * Entidade Task — alinhada ao MindEase (web).
 * Persistência: Firestore em users/{userId}, campo kanban.tasks = { [taskId]: Task }.
 * Qualquer plataforma que leia o mesmo documento vê as mesmas tarefas e tempo de foco.
 *
 * Status: todo | doing | done (A Fazer, Fazendo, Feito).
 *
 * Tempo de foco (cross-platform):
 * - focusTimerStartedAt e focusTimerPausedAt são timestamps em milissegundos (number).
 * - Sem foco: ambos ausentes/undefined → tempo total = 0.
 * - Rodando: focusTimerStartedAt preenchido, focusTimerPausedAt ausente
 *   → elapsed = (Date.now() - focusTimerStartedAt) / 1000 (segundos).
 * - Finalizado: ambos preenchidos → tempo total = (focusTimerPausedAt - focusTimerStartedAt) / 1000.
 */
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  checklist: ChecklistItem[];
  points: number;
  pointsAwarded?: boolean;

  createdAtISO: string;
  updatedAtISO: string;
  completedAtISO?: string;
  order: number;

  /** ID do board (único board por enquanto: "default") */
  boardId: string;

  /** Foco: início (ms). Ausente = nunca iniciou (tempo 0). */
  focusTimerStartedAt?: number;
  /** Foco: pausa/fim (ms). Ausente com startedAt = ainda rodando; preenchido = finalizado com tempo total. */
  focusTimerPausedAt?: number;
}

/** Segundos de foco já contabilizados (para qualquer plataforma). */
export function getFocusElapsedSeconds(task: Task): number {
  if (task.focusTimerStartedAt == null) return 0;
  const end = task.focusTimerPausedAt ?? Date.now();
  return Math.floor((end - task.focusTimerStartedAt) / 1000);
}

/** True se o timer de foco está rodando agora. */
export function isFocusRunning(task: Task): boolean {
  return task.focusTimerStartedAt != null && task.focusTimerPausedAt == null;
}
