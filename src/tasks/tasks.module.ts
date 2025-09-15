import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from '../infrastructure/persistence/mongo/schemas/task.schema';
import { TasksController } from '../infrastructure/http/tasks.controller';
import { CreateTaskUseCase } from '../application/tasks/use-cases/create-task.usecase';
import { ProcessTaskUseCase } from '../application/tasks/use-cases/process-task.usecase';
import { GetTaskUseCase } from '../application/tasks/use-cases/get-task.usecase';
import { TaskService } from '../domain/tasks/task.service';
import { TaskRepositoryMongo } from '../infrastructure/persistence/mongo/task.repository.mongo';
import { DownloadAdapter } from '../infrastructure/files/download.adapter';
import { SharpAdapter } from 'src/infrastructure/image-processing/sharp.adapter';
import { Tokens } from '../common/constants/tokens.constant';

/**
 * Tasks Module
 * 
 * This module serves as the composition root for the tasks feature,
 * wiring together controllers, use cases, domain services, and infrastructure.
 */
@Module({
  imports: [
    // Schemas
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
  ],
  controllers: [TasksController],
  providers: [
    // Domain
    TaskService,

    // Infrastructure
    {
      provide: Tokens.Repository.Tasks,
      useClass: TaskRepositoryMongo,
    },
    {
      provide: Tokens.Adapter.Download,
      useClass: DownloadAdapter,
    },
    {
      provide: Tokens.Adapter.Sharp,
      useClass: SharpAdapter,
    },

    // Use cases
    {
      provide: GetTaskUseCase,
      useFactory: (taskRepository) => {
        return new GetTaskUseCase(taskRepository);
      },
      inject: [Tokens.Repository.Tasks],
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (taskRepository, taskService, downloadAdapter) => {
        return new CreateTaskUseCase(
          taskRepository,
          taskService,
          downloadAdapter,
        );
      },
      inject: [Tokens.Repository.Tasks, TaskService, Tokens.Adapter.Download],
    },
    {
      provide: ProcessTaskUseCase,
      useFactory: (taskRepository, taskService, sharpAdapter) => {
        return new ProcessTaskUseCase(
          taskRepository,
          taskService,
          sharpAdapter,
        );
      },
      inject: [
        Tokens.Repository.Tasks,
        TaskService,
        Tokens.Adapter.Sharp,
      ],
    },
  ],
  exports: [
    Tokens.Repository.Tasks,
    Tokens.Adapter.Sharp,
    Tokens.Adapter.Download,
    CreateTaskUseCase,
    GetTaskUseCase,
    ProcessTaskUseCase,
  ],
})
export class TasksModule {}
