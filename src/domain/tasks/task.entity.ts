/**
 * Interface for image information in a task
 */
export interface TaskImage {
  resolution: string;
  path: string;
}

/**
 * Task Entity
 */
export class Task {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  price: number;
  originalPath: string;
  images: TaskImage[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
    this.images = this.images || [];
  }
}
