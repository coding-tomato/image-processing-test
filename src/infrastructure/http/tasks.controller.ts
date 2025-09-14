import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from '../../application/tasks/dto/create-task.dto';
import { TaskResponseDto } from '../../application/tasks/dto/task-response.dto';
import { CreateTaskUseCase } from '../../application/tasks/use-cases/create-task.usecase';
import { GetTaskUseCase } from '../../application/tasks/use-cases/get-task.usecase';
import { ProcessTaskUseCase } from '../../application/tasks/use-cases/process-task.usecase';

/**
 * Tasks Controller
 * 
 * This controller handles HTTP requests related to tasks.
 */
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly processTaskUseCase: ProcessTaskUseCase
  ) {}

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
    const taskResponse = await this.createTaskUseCase.execute(createTaskDto);
    
    // Start processing the task asynchronously
    this.processTaskUseCase.execute(taskResponse.taskId)
      .catch(error => console.error(`Error processing task ${taskResponse.taskId}:`, error));
    
    return taskResponse;
  }

  /**
   * Get a task by its ID
   * 
   * @param id The ID of the task to retrieve
   * @returns A promise resolving to the task details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task identifier', type: 'string' })
  @ApiOkResponse({
    description: 'The task has been successfully retrieved',
    type: TaskResponseDto
  })
  async getTask(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.getTaskUseCase.execute(id);
  }
}
