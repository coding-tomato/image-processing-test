export type ImageVariant = {
  resolution: string;
  path: string;
  md5: string;
};

/**
 * Repository interface for image operations
 */
export interface ImageProcessingRepository {
  /**
   * Process an image and generate variants in different resolutions
   * @param filePath Path to the image file on the local filesystem
   * @returns Promise with array of generated image variants
   */
  generateVariants(filePath: string): Promise<ImageVariant[]>;
}