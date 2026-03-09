import type { ITasksRepository } from '../../domain/contracts/repositories/ITasksRepository';
import type { Task, TaskStatus } from '../../domain/entities/Task';

/**
 * Stub do repositório de tarefas (quando Firebase não está configurado).
 * Mantém tarefas em memória por sessão.
 */
const memory = new Map<string, Task[]>();

function getTasks(userId: string): Task[] {
  if (!memory.has(userId)) memory.set(userId, []);
  return memory.get(userId)!;
}

export class StubTasksRepository implements ITasksRepository {
  async list(userId: string): Promise<Task[]> {
    return [...getTasks(userId)];
  }

  async create(
    userId: string,
    input: Omit<Task, 'id' | 'createdAtISO' | 'updatedAtISO'>
  ): Promise<Task> {
    const now = new Date().toISOString();
    const id = 't_' + Math.random().toString(36).slice(2, 11);
    const task: Task = {
      ...input,
      id,
      createdAtISO: now,
      updatedAtISO: now,
      boardId: input.boardId ?? 'default',
    };
    const tasks = getTasks(userId);
    tasks.push(task);
    return task;
  }

  async update(userId: string, task: Task): Promise<Task> {
    const updated = { ...task, updatedAtISO: new Date().toISOString() };
    const tasks = getTasks(userId);
    const i = tasks.findIndex((t) => t.id === task.id);
    if (i >= 0) tasks[i] = updated;
    return updated;
  }

  async remove(userId: string, id: string): Promise<void> {
    const tasks = getTasks(userId);
    const i = tasks.findIndex((t) => t.id === id);
    if (i >= 0) tasks.splice(i, 1);
  }

  async move(userId: string, id: string, status: TaskStatus): Promise<Task> {
    const tasks = getTasks(userId);
    const found = tasks.find((t) => t.id === id);
    if (!found) throw new Error('Task not found');
    const now = new Date().toISOString();
    const moved: Task = {
      ...found,
      status,
      completedAtISO: status === 'done' ? found.completedAtISO ?? now : undefined,
      updatedAtISO: now,
    };
    const i = tasks.findIndex((t) => t.id === id);
    if (i >= 0) tasks[i] = moved;
    return moved;
  }
}
