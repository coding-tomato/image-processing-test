import { Image } from "./image.entity";

/**
 * Task Entity
 */
export class Task {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  price: number;
  originalPath: string;
  images: Image[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
    this.images = this.images || [];
  }
}
