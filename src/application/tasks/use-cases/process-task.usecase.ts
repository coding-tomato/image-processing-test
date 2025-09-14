import { NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/tasks/task.entity';
import { TaskRepository } from '../../../domain/tasks/task.repository.port';
import { TaskService } from '../../../domain/tasks/task.service';

/**
 * Process Task Use Case
 * 
 * This use case handles the processing of a task, which includes:
 * - Retrieving the task by ID
 * - Processing the image using appropriate adapters
 * - Updating the task status based on the result
 */
export class ProcessTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskService: TaskService,
  ) {}

  /**
   * Execute the process task use case
   * @param taskId The ID of the task to process
   * @returns Promise resolving to the processed task
   */
  async execute(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (task.status !== 'pending') {
      return task;
    }

    try {
      // Implement actual image processing logic here
      // 1. Download or access the original image (via FS/HTTP adapter)
      // 2. Process image variants with SharpAdapter
      // 3. Save results in ImageRepository
      
      // Temporary, mark as completed, image generaration is left to do
      console.log(`[ProcessTaskUseCase] Processing task ${taskId} with image at ${task.originalPath}`);
      const updatedTask = this.taskService.markCompleted(task);
      
      // Save the updated task
      return this.taskRepository.save(updatedTask);
    } catch (error) {
      console.error(`[ProcessTaskUseCase] Error processing task ${taskId}:`, error);
      
      const failedTask = this.taskService.markFailed(task);
      
      return this.taskRepository.save(failedTask);
    }
  }
}
