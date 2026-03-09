import type { ITasksRepository } from '../../contracts/repositories/ITasksRepository';
import type { Task, ChecklistItem } from '../../entities/Task';

export type CreateTaskInput = {
  title: string;
  description?: string;
  points?: number;
  /** Itens do checklist (opcional). Cada um vira { id, label, done: false }. */
  checklist?: { label: string }[];
};

function toChecklistItems(items: { label: string }[]): ChecklistItem[] {
  const now = Date.now();
  return items
    .filter((i) => i.label.trim().length > 0)
    .map((i, idx) => ({
      id: 'c_' + now + '_' + idx,
      label: i.label.trim(),
      done: false,
    }));
}

export class CreateTaskUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async execute(userId: string, input: CreateTaskInput): Promise<Task> {
    const checklist = input.checklist?.length
      ? toChecklistItems(input.checklist)
      : [];
    return this.tasksRepository.create(userId, {
      title: input.title,
      description: input.description,
      status: 'todo',
      points: input.points ?? 10,
      pointsAwarded: false,
      checklist,
      order: 0,
      boardId: 'default',
    });
  }
}
