import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { GetTaskUseCase } from './get-task.usecase';
import { TaskSchema } from './../../infrastructure/persistence/mongo/schemas/task.schema';
import { TaskRepositoryMongo } from './../../infrastructure/persistence/mongo/task.repository.mongo';
import { Model } from 'mongoose';

describe('GetTaskUseCase', () => {
  let mongoServer: MongoMemoryServer;
  let taskModel: Model<any>;
  let taskRepository: TaskRepositoryMongo;
  let getTaskUseCase: GetTaskUseCase;

  // Test data
  const mockTaskId = '507f1f77bcf86cd799439011';
  const mockTask = {
    id: mockTaskId,
    status: 'pending',
    price: 25,
    originalPath: '/path/to/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockImages = [
    {
      resolution: '1024x768',
      path: '/processed/image_1024.jpg',
    },
    {
      resolution: '640x480',
      path: '/processed/image_640.jpg',
    },
  ];

  const mockCompletedTask = {
    id: '507f1f77bcf86cd799439012',
    status: 'completed',
    price: 30,
    originalPath: '/path/to/another-image.jpg',
    images: mockImages,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create the models for our repositories
    taskModel = mongoose.model('Task', TaskSchema);

    // Setup our dependencies
    taskRepository = new TaskRepositoryMongo(taskModel);
    getTaskUseCase = new GetTaskUseCase(taskRepository);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await taskModel.deleteMany({});
  });

  it('should throw NotFoundException when task is not found', async () => {
    await expect(getTaskUseCase.execute('nonexistentId')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should retrieve a pending task without images', async () => {
    await taskModel.create(mockTask);

    const result = await getTaskUseCase.execute(mockTaskId);

    expect(result).toBeDefined();
    expect(result.taskId).toBe(mockTaskId);
    expect(result.status).toBe('pending');
    expect(result.price).toBe(25);
    expect(result.images).toBeUndefined();
  });

  it('should retrieve a completed task with images', async () => {
    await taskModel.create(mockCompletedTask);

    const result = await getTaskUseCase.execute(mockCompletedTask.id);

    expect(result).toBeDefined();
    expect(result.taskId).toBe(mockCompletedTask.id);
    expect(result.status).toBe('completed');
    expect(result.price).toBe(30);
    expect(result.images).toBeDefined();
    expect(result.images?.length).toBe(2);
    expect(result.images?.[0].resolution).toBe('1024x768');
    expect(result.images?.[0].path).toBe('/processed/image_1024.jpg');
    expect(result.images?.[1].resolution).toBe('640x480');
    expect(result.images?.[1].path).toBe('/processed/image_640.jpg');
  });

  it('should retrieve a failed task without images', async () => {
    const mockFailedTask = { ...mockTask, status: 'failed' };
    await taskModel.create(mockFailedTask);

    const result = await getTaskUseCase.execute(mockTaskId);

    expect(result).toBeDefined();
    expect(result.taskId).toBe(mockTaskId);
    expect(result.status).toBe('failed');
    expect(result.price).toBe(25);
    expect(result.images).toBeUndefined();
  });
});
