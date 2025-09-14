import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { TaskService } from '../../../domain/tasks/task.service';
import { CreateTaskUseCase } from './create-task.usecase';
import { TaskSchema } from '../../../infrastructure/persistence/mongo/schemas/task.schema';
import { TaskRepositoryMongo } from '../../../infrastructure/persistence/mongo/task.repository.mongo';
import { Model } from 'mongoose';

describe('CreateTaskUseCase', () => {
  let mongoServer: MongoMemoryServer;
  let taskModel: Model<any>;
  let taskRepository: TaskRepositoryMongo;
  let taskService: TaskService;
  let createTaskUseCase: CreateTaskUseCase;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create the model for our repository
    taskModel = mongoose.model('Task', TaskSchema);
    
    // Setup our dependencies
    taskRepository = new TaskRepositoryMongo(taskModel);
    taskService = new TaskService();
    createTaskUseCase = new CreateTaskUseCase(taskRepository, taskService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a task', async () => {
    const imagePath = '/path/to/image.jpg';
    
    const result = await createTaskUseCase.execute({ imagePath });
    
    expect(result).toBeDefined();
    expect(result.taskId).toBeDefined();
    expect(result.status).toBe('pending');
    expect(result.price).toBeGreaterThanOrEqual(5);
    expect(result.price).toBeLessThanOrEqual(50);
  });
});