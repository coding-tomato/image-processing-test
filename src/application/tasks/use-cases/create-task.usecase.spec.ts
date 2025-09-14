import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { TaskService } from '../../../domain/tasks/task.service';
import { CreateTaskUseCase } from './create-task.usecase';
import { TaskSchema } from '../../../infrastructure/persistence/mongo/schemas/task.schema';
import { TaskRepositoryMongo } from '../../../infrastructure/persistence/mongo/task.repository.mongo';
import { Model } from 'mongoose';
import { DownloadAdapter } from '../../../infrastructure/files/download.adapter';

describe('CreateTaskUseCase', () => {
  let mongoServer: MongoMemoryServer;
  let taskModel: Model<any>;
  let taskRepository: TaskRepositoryMongo;
  let taskService: TaskService;
  let downloadAdapter: DownloadAdapter;
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
    downloadAdapter = new DownloadAdapter();
    createTaskUseCase = new CreateTaskUseCase(taskRepository, taskService, downloadAdapter);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a task with a local file path', async () => {
    // Mock the getFilePath method to return a fixed path
    jest.spyOn(downloadAdapter, 'getFilePath').mockResolvedValueOnce('/processed/path/image.jpg');
    
    const imagePath = '/path/to/image.jpg';
    
    const result = await createTaskUseCase.execute({ imagePath });
    
    expect(result).toBeDefined();
    expect(result.taskId).toBeDefined();
    expect(result.status).toBe('pending');
    expect(result.price).toBeGreaterThanOrEqual(5);
    expect(result.price).toBeLessThanOrEqual(50);
    
    // Verify the download adapter was called with the correct path
    expect(downloadAdapter.getFilePath).toHaveBeenCalledWith(imagePath);
  });
  
  it('should create a task with a URL', async () => {
    // Mock the getFilePath method to return a fixed path
    jest.spyOn(downloadAdapter, 'getFilePath').mockResolvedValueOnce('/downloaded/path/image.jpg');
    
    const imageUrl = 'https://example.com/image.jpg';
    
    const result = await createTaskUseCase.execute({ imagePath: imageUrl });
    
    expect(result).toBeDefined();
    expect(result.taskId).toBeDefined();
    expect(result.status).toBe('pending');
    expect(result.price).toBeGreaterThanOrEqual(5);
    expect(result.price).toBeLessThanOrEqual(50);
    
    // Verify the download adapter was called with the correct URL
    expect(downloadAdapter.getFilePath).toHaveBeenCalledWith(imageUrl);
  });
});