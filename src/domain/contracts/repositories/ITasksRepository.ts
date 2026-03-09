import type { Task, TaskStatus } from '../../entities/Task';

/**
 * Contrato do repositório de tarefas.
 * Alinhado ao MindEase (web); persistência em users/{userId} (Firebase).
 */
export interface ITasksRepository {
  list(userId: string): Promise<Task[]>;
  create(userId: string, input: Omit<Task, 'id' | 'createdAtISO' | 'updatedAtISO'>): Promise<Task>;
  update(userId: string, task: Task): Promise<Task>;
  remove(userId: string, id: string): Promise<void>;
  move(userId: string, id: string, status: TaskStatus): Promise<Task>;
}
