import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from '../infrastructure/persistence/mongo/schemas/task.schema';
import { ImageSchema } from '../infrastructure/persistence/mongo/schemas/image.schema';
import { TasksController } from '../infrastructure/http/tasks.controller';
import { CreateTaskUseCase } from '../application/tasks/use-cases/create-task.usecase';
import { ProcessTaskUseCase } from '../application/tasks/use-cases/process-task.usecase';
import { GetTaskUseCase } from '../application/tasks/use-cases/get-task.usecase';
import { TaskService } from '../domain/tasks/task.service';
import { TaskRepositoryMongo } from '../infrastructure/persistence/mongo/task.repository.mongo';
import { ImageRepositoryMongo } from '../infrastructure/persistence/mongo/image.repository.mongo';

// Tokens for repository injection
export const TASK_REPOSITORY = 'TASK_REPOSITORY';
export const IMAGE_REPOSITORY = 'IMAGE_REPOSITORY';

/**
 * Tasks Module
 * 
 * This module serves as the composition root for the tasks feature,
 * wiring together controllers, use cases, domain services, and infrastructure.
 */
@Module({
  imports: [
    // Schemas
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema },
      { name: 'ImageDocument', schema: ImageSchema }
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
    {
      provide: IMAGE_REPOSITORY,
      useClass: ImageRepositoryMongo,
    },
    
    // Use cases
    {
      provide: GetTaskUseCase,
      useFactory: (taskRepository, imageRepository) => {
        return new GetTaskUseCase(taskRepository, imageRepository);
      },
      inject: [TASK_REPOSITORY, IMAGE_REPOSITORY],
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
    IMAGE_REPOSITORY,
    CreateTaskUseCase,
    GetTaskUseCase,
    ProcessTaskUseCase,
  ],
})
export class TasksModule {}
