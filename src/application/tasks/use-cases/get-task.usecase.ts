import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '../../../domain/tasks/task.repository.port';
import { ImageRepository } from '../../../domain/images/image.repository.port';
import { TaskResponseDto } from '../dto/task-response.dto';

/**
 * Get Task Use Case
 * 
 * This use case retrieves a task by ID and returns it as a DTO.
 * If the task is completed, it also fetches related images.
 */
@Injectable()
export class GetTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  /**
   * Execute the use case to get a task by ID
   * @param taskId The ID of the task to retrieve
   * @returns A promise resolving to the task response DTO
   * @throws NotFoundException if the task is not found
   */
  async execute(taskId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const response: TaskResponseDto = {
      taskId: task.id,
      status: task.status,
      price: task.price,
    };

    if (task.status === 'completed') {
      const images = await this.imageRepository.findByTaskId(taskId);
      response.images = images.map(image => ({
        resolution: image.resolution,
        path: image.path,
      }));
    }

    return response;
  }
}
