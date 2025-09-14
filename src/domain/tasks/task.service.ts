import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';

/**
 * Task Domain Service
 */
@Injectable()
export class TaskService {
  /**
   * Assigns a random price to a task within a specified range
   * @param min Minimum price value (default: 5)
   * @param max Maximum price value (default: 50)
   * @returns A random price within the specified range
   */
  assignPrice(min = 5, max = 50): number {
    min = Math.max(0, min);
    max = Math.max(min, max);
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Marks a task as completed
   * @param task The task to mark as completed
   * @returns The updated task with completed status
   */
  markCompleted(task: Task): Task {
    if (!task) {
      throw new Error('Task cannot be null or undefined');
    }

    const updatedTask = new Task({
      ...task,
      status: 'completed',
      updatedAt: new Date()
    });
    
    return updatedTask;
  }

  /**
   * Marks a task as failed
   * @param task The task to mark as failed
   * @returns The updated task with failed status
   */
  markFailed(task: Task): Task {
    if (!task) {
      throw new Error('Task cannot be null or undefined');
    }

    const updatedTask = new Task({
      ...task,
      status: 'failed',
      updatedAt: new Date()
    });
    
    return updatedTask;
  }
}
