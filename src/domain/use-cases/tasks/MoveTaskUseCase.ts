import type { ITasksRepository } from '../../contracts/repositories/ITasksRepository';
import type { TaskStatus } from '../../entities/Task';

export class MoveTaskUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async execute(userId: string, taskId: string, status: TaskStatus): Promise<ReturnType<ITasksRepository['move']>> {
    return this.tasksRepository.move(userId, taskId, status);
  }
}
