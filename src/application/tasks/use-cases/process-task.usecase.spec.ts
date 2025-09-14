import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { ProcessTaskUseCase } from './process-task.usecase';
import { TaskSchema } from '../../../infrastructure/persistence/mongo/schemas/task.schema';
import { TaskRepositoryMongo } from '../../../infrastructure/persistence/mongo/task.repository.mongo';
import { TaskService } from '../../../domain/tasks/task.service';
import { Task } from '../../../domain/tasks/task.entity';
import { Model } from 'mongoose';

describe('ProcessTaskUseCase', () => {
  let mongoServer: MongoMemoryServer;
  let taskModel: Model<any>;
  let taskRepository: TaskRepositoryMongo;
  let taskService: TaskService;
  let processTaskUseCase: ProcessTaskUseCase;
  
  // Test data
  const mockTaskId = '507f1f77bcf86cd799439011';
  const mockTask: Task = new Task({
    id: mockTaskId,
    status: 'pending',
    price: 25,
    originalPath: '/path/to/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const mockCompletedTask: Task = new Task({
    id: '507f1f77bcf86cd799439012',
    status: 'completed',
    price: 30,
    originalPath: '/path/to/another-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const mockFailedTask: Task = new Task({
    id: '507f1f77bcf86cd799439013',
    status: 'failed',
    price: 35,
    originalPath: '/path/to/broken-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create the model for our repository
    taskModel = mongoose.model('Task', TaskSchema);
    
    // Setup our dependencies
    taskRepository = new TaskRepositoryMongo(taskModel);
    taskService = new TaskService();
    processTaskUseCase = new ProcessTaskUseCase(taskRepository, taskService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await taskModel.deleteMany({});
    
    // Spy on console.log and console.error
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console mocks
    jest.restoreAllMocks();
  });

  it('should throw NotFoundException when task is not found', async () => {
    // Arrange - no task in database
    
    await expect(processTaskUseCase.execute('nonexistentId')).rejects.toThrow(NotFoundException);
  });

  it('should not process a task that is already completed', async () => {
    // Arrange
    await taskModel.create(mockCompletedTask);
    const saveSpy = jest.spyOn(taskRepository, 'save');
    
    
    const result = await processTaskUseCase.execute(mockCompletedTask.id);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(mockCompletedTask.id);
    expect(result.status).toBe('completed');
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should not process a task that has already failed', async () => {
    await taskModel.create(mockFailedTask);
    const saveSpy = jest.spyOn(taskRepository, 'save');
    
    const result = await processTaskUseCase.execute(mockFailedTask.id);
    
    expect(result).toBeDefined();
    expect(result.id).toBe(mockFailedTask.id);
    expect(result.status).toBe('failed');
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should process a pending task and mark it as completed', async () => {
    await taskModel.create(mockTask);
    const markCompletedSpy = jest.spyOn(taskService, 'markCompleted');
    
    const result = await processTaskUseCase.execute(mockTaskId);
    
    expect(result).toBeDefined();
    expect(result.id).toBe(mockTaskId);
    expect(result.status).toBe('completed');
    expect(markCompletedSpy).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(`Processing task ${mockTaskId} with image at ${mockTask.originalPath}`)
    );
  });

  it('should mark a task as failed when an error occurs during processing', async () => {
    await taskModel.create(mockTask);
    const mockError = new Error('Processing error');
    jest.spyOn(taskService, 'markCompleted').mockImplementation(() => {
      throw mockError;
    });
    const markFailedSpy = jest.spyOn(taskService, 'markFailed');
    
    const result = await processTaskUseCase.execute(mockTaskId);
    
    expect(result).toBeDefined();
    expect(result.id).toBe(mockTaskId);
    expect(result.status).toBe('failed');
    expect(markFailedSpy).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error processing task ${mockTaskId}:`),
      mockError
    );
  });
});
