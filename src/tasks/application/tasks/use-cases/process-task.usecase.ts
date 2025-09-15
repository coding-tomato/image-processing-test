import { NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/tasks/task.entity';
import { TaskRepository } from '../../../domain/tasks/task.repository.port';
import { TaskService } from '../../../domain/tasks/task.service';
import { SharpAdapter } from '../../../infrastructure/image-processing/sharp.adapter';

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
    private readonly sharpAdapter: SharpAdapter,
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
      // Image processing logic
      // 1. The image has already been downloaded or resolved by CreateTaskUseCase
      // 2. Process image variants with SharpAdapter
      // 3. Save results
      
      // The originalPath now contains the absolute path processed by DownloadAdapter
      console.log(`[ProcessTaskUseCase] Processing task ${taskId} with image at ${task.originalPath}`);
      
      // Generate image variants using SharpAdapter
      const imageVariants = await this.sharpAdapter.generateVariants(
        task.originalPath,
      );

      // Update the task with processed image information
      const updatedTask = new Task({
        ...task,
        images: imageVariants.map((variant) => ({
          resolution: variant.resolution,
          path: variant.path,
        })),
      });

      // Mark the task as completed
      const completedTask = this.taskService.markCompleted(updatedTask);

      // Save the updated task
      return this.taskRepository.save(completedTask);
    } catch (error) {
      console.error(`[ProcessTaskUseCase] Error processing task ${taskId}:`, error);
      
      const failedTask = this.taskService.markFailed(task);
      
      return this.taskRepository.save(failedTask);
    }
  }
}
