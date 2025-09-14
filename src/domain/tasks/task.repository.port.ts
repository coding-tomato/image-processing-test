import { Task } from './task.entity';

/**
 * Task Repository Port
 * Defines the contract for interacting with Task persistence.
 */
export interface TaskRepository {
  /**
   * Save a task to the repository
   * @param task The task to save
   * @returns Promise resolving to the saved task
   */
  save(task: Task): Promise<Task>;
  
  /**
   * Find a task by its id
   * @param id The task id
   * @returns Promise resolving to the found task or null if not found
   */
  findById(id: string): Promise<Task | null>;
}
