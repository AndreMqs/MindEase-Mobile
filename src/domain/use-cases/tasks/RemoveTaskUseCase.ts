import type { ITasksRepository } from '../../contracts/repositories/ITasksRepository';

export class RemoveTaskUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async execute(userId: string, taskId: string): Promise<void> {
    return this.tasksRepository.remove(userId, taskId);
  }
}
