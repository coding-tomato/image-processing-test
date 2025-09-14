import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from '../infrastructure/persistence/mongo/schemas/task.schema';
import { TasksController } from '../infrastructure/http/tasks.controller';
import { CreateTaskUseCase } from '../application/tasks/use-cases/create-task.usecase';
import { TaskService } from '../domain/tasks/task.service';
import { TaskRepositoryMongo } from '../infrastructure/persistence/mongo/task.repository.mongo';

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
      provide: 'TaskRepository',
      useClass: TaskRepositoryMongo,
    },
    
    // Use cases
    {
      provide: CreateTaskUseCase,
      useFactory: (taskRepository, taskService) => {
        return new CreateTaskUseCase(taskRepository, taskService);
      },
      inject: ['TaskRepository', TaskService],
    },
  ],
  exports: [
    'TaskRepository',
    CreateTaskUseCase,
  ],
})
export class TasksModule {}
