/**
 * Create Task DTO
 * 
 * This DTO represents the input data required to create a new task.
 * It's decorated with Swagger annotations for API documentation.
 */
export class CreateTaskDto {
  /**
   * Path to the image to process
   * This can be a local file path or a URL
   * @example "/path/to/image.jpg" or "https://example.com/image.jpg"
   */
  imagePath: string;
}
