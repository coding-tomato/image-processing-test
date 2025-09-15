import { Task } from './../../domain/task.entity';
import { TaskRepository } from './../../domain/task.repository.port';
import { TaskService } from './../../domain/task.service';
import { DownloadAdapter } from './../../infrastructure/files/download.adapter';
import { CreateTaskDto } from './../dto/create-task.dto';
import { TaskResponseDto } from './../dto/task-response.dto';

/**
 * Create Task Use Case
 * 
 * Handles the creation of a new task with a pending status,
 * assigns it a random price using the domain service, and persists it
 * via the TaskRepository port.
 */
export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskService: TaskService,
    private readonly downloadAdapter: DownloadAdapter,
  ) {}

  /**
   * Execute the use case
   * @param input Input data containing the path to the image to process
   * @returns Promise resolving to the created task details
   */
  async execute(input: CreateTaskDto): Promise<TaskResponseDto> {
    // Process the image path (download if URL, resolve if local)
    const processedPath = await this.downloadAdapter.getFilePath(input.imagePath);
    
    // Generate a random price using domain service
    const price = this.taskService.assignPrice();

    const task = new Task({
      status: 'pending',
      price,
      originalPath: processedPath,
    });

    // Persist the task using the repository
    const savedTask = await this.taskRepository.save(task);

    // Return the task details
    return {
      taskId: savedTask.id,
      status: savedTask.status,
      price: savedTask.price,
    };
  }
}
