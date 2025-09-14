import { Image } from './image.entity';

/**
 * Image Repository Port
 * 
 * Defines the contract for image repository operations in the domain.
 */
export interface ImageRepository {
  /**
   * Saves an image to the repository
   * @param image The image entity to save
   * @returns A promise that resolves to the saved image
   */
  save(image: Image): Promise<Image>;

  /**
   * Finds all images associated with a specific task
   * @param taskId The ID of the task to find images for
   * @returns A promise that resolves to an array of images
   */
  findByTaskId(taskId: string): Promise<Image[]>;
}
