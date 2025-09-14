import { Task } from '../../../domain/tasks/task.entity';
import { TaskRepository } from '../../../domain/tasks/task.repository.port';
import { TaskService } from '../../../domain/tasks/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskResponseDto } from '../dto/task-response.dto';

/**
 * Create Task Use Case
 * 
 * This use case handles the creation of a new task with a pending status,
 * assigns it a random price using the domain service, and persists it
 * via the TaskRepository port.
 */
export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskService: TaskService,
  ) {}

  /**
   * Execute the use case
   * @param input Input data containing the path to the image to process
   * @returns Promise resolving to the created task details
   */
  async execute(input: CreateTaskDto): Promise<TaskResponseDto> {
    // Generate a random price using domain service
    const price = this.taskService.assignPrice();

    // Create a new Task with pending status
    // Note: ID generation is now handled by MongoDB in the repository layer
    const task = new Task({
      status: 'pending',
      price,
      originalPath: input.imagePath,
    });

    // Persist the task using the repository
    // The repository implementation will ensure MongoDB generates an ID
    const savedTask = await this.taskRepository.save(task);

    // Return the task details
    return {
      taskId: savedTask.id,
      status: savedTask.status,
      price: savedTask.price,
    };
  }

  // ID generation method removed as we're now letting MongoDB handle this
}
