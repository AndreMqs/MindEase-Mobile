import type { ITasksRepository } from '../../contracts/repositories/ITasksRepository';
import type { Task } from '../../entities/Task';

export class UpdateTaskUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async execute(userId: string, task: Task): Promise<Task> {
    return this.tasksRepository.update(userId, {
      ...task,
      updatedAtISO: new Date().toISOString(),
    });
  }
}
