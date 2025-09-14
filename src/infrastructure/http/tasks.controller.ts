import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from '../../application/tasks/dto/create-task.dto';
import { TaskResponseDto } from '../../application/tasks/dto/task-response.dto';
import { CreateTaskUseCase } from '../../application/tasks/use-cases/create-task.usecase';

/**
 * Tasks Controller
 * 
 * This controller handles HTTP requests related to tasks.
 */
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  /**
   * Create a new image processing task
   * 
   * @param createTaskDto The data required to create a new task
   * @returns A promise resolving to the created task details
   */
  @Post()
  @ApiOperation({ summary: 'Create a new image processing task' })
  @ApiCreatedResponse({ 
    description: 'The task has been successfully created.',
    type: TaskResponseDto 
  })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.createTaskUseCase.execute(createTaskDto);
  }
}
