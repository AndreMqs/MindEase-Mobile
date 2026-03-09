import type { ITasksRepository } from '../../contracts/repositories/ITasksRepository';
import type { Task } from '../../entities/Task';

export class ListTasksUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async execute(userId: string): Promise<Task[]> {
    return this.tasksRepository.list(userId);
  }
}
