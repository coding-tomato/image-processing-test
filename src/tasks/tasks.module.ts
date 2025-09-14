import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from '../infrastructure/persistence/mongo/schemas/task.schema';
import { TasksController } from '../infrastructure/http/tasks.controller';
import { CreateTaskUseCase } from '../application/tasks/use-cases/create-task.usecase';
import { ProcessTaskUseCase } from '../application/tasks/use-cases/process-task.usecase';
import { TaskService } from '../domain/tasks/task.service';
import { TaskRepositoryMongo } from '../infrastructure/persistence/mongo/task.repository.mongo';
import { GetTaskUseCase } from 'src/application/tasks/use-cases/get-task.usecase';

// Token for TaskRepository injection
export const TASK_REPOSITORY = 'TASK_REPOSITORY';

/**
 * Tasks Module
 * 
 * This module serves as the composition root for the tasks feature,
 * wiring together controllers, use cases, domain services, and infrastructure.
 */
@Module({
  imports: [
    // Schema
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema }
    ])
  ],
  controllers: [TasksController],
  providers: [
    // Domain
    TaskService,
    
    // Infrastructure
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepositoryMongo,
    },
    
    // Use cases
    {
      provide: GetTaskUseCase,
      useFactory: (taskRepository, taskService) => {
        return new GetTaskUseCase(taskRepository, taskService);
      },
      inject: [TASK_REPOSITORY, TaskService],
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (taskRepository, taskService) => {
        return new CreateTaskUseCase(taskRepository, taskService);
      },
      inject: [TASK_REPOSITORY, TaskService],
    },
    {
      provide: ProcessTaskUseCase,
      useFactory: (taskRepository, taskService) => {
        return new ProcessTaskUseCase(taskRepository, taskService);
      },
      inject: [TASK_REPOSITORY, TaskService],
    },
  ],
  exports: [
    TASK_REPOSITORY,
    CreateTaskUseCase,
    ProcessTaskUseCase,
  ],
})
export class TasksModule {}
