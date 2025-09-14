/**
 * Image entity class
 * 
 * This is a pure TypeScript class representing an image entity in the domain.
 * It follows the hexagonal architecture principles by being framework-agnostic.
 */
export class Image {
  id: string;
  taskId: string;
  resolution: string;
  path: string;
  md5: string;
  createdAt: Date;

  constructor(params: {
    id: string;
    taskId: string;
    resolution: string;
    path: string;
    md5: string;
    createdAt?: Date;
  }) {
    this.id = params.id;
    this.taskId = params.taskId;
    this.resolution = params.resolution;
    this.path = params.path;
    this.md5 = params.md5;
    this.createdAt = params.createdAt || new Date();
  }
}
