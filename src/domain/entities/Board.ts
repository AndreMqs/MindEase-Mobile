/**
 * Board Kanban — um único board por usuário (default).
 * Estrutura preparada para múltiplos boards no futuro.
 */
export interface Board {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_BOARD_ID = 'default';
