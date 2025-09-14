import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../../../domain/tasks/task.entity';
import { TaskRepository } from '../../../domain/tasks/task.repository.port';
import { TaskDocument } from './schemas/task.schema';

/**
 * MongoDB implementation of the TaskRepository port
 * 
 * This class adapts the TaskRepository port to MongoDB using Mongoose.
 * It fulfills the contract defined by the TaskRepository interface.
 */
@Injectable()
export class TaskRepositoryMongo implements TaskRepository {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<TaskDocument>,
  ) {}

  /**
   * Maps a Mongoose document to a domain Task entity
   */
  private toEntity(document: TaskDocument): Task {
    if (!document) return null;
    
    return new Task({
      id: document.id,
      status: document.status,
      price: document.price,
      originalPath: document.originalPath,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  /**
   * Maps a domain Task entity to a format suitable for Mongoose
   */
  private toDocument(task: Task): Partial<TaskDocument> {
    return {
      id: task.id || this.generateId(),
      status: task.status,
      price: task.price,
      originalPath: task.originalPath,
      createdAt: task.createdAt,
      updatedAt: new Date(),
    };
  }
  
  /**
   * Generates a string ID using MongoDB's ObjectId
   */
  private generateId(): string {
    return new this.taskModel().id;
  }

  /**
   * Save a task to MongoDB
   * @param task The task entity to save
   * @returns Promise resolving to the saved task entity
   */
  async save(task: Task): Promise<Task> {
    const exists = task.id && await this.taskModel.findOne({ id: task.id }).exec();
    
    if (exists) {
      // Update existing task
      const updated = await this.taskModel
        .findOneAndUpdate(
          { id: task.id },
          this.toDocument(task),
          { new: true }
        )
        .exec();
      return this.toEntity(updated);
    } else {
      // Create new task
      const newTask = new this.taskModel(this.toDocument(task));
      const saved = await newTask.save();
      return this.toEntity(saved);
    }
  }

  /**
   * Find a task by ID in MongoDB
   * @param id The task ID to find
   * @returns Promise resolving to the found task entity or null if not found
   */
  async findById(id: string): Promise<Task | null> {
    const document = await this.taskModel.findOne({ id }).exec();
    return document ? this.toEntity(document) : null;
  }
}
