/**
 * Repository interface for image operations
 */
export interface ImageRepository {
  /**
   * Get the local file path from a source URL or path
   * @param sourcePath URL or local file path to the image
   * @returns Promise with the absolute path to the file on the local filesystem
   */
  getLocalFilePath(sourcePath: string): Promise<string>;
}