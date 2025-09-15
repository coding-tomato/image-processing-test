/**
 * Task Response DTO
 * 
 * This DTO represents the response data for task-related operations.
 * It's decorated with Swagger annotations for API documentation.
 */
export class TaskResponseDto {
  /**
   * Unique identifier for the task
   * @example "1631234567890abc123"
   */
  taskId: string;
  
  /**
   * Current status of the task
   * @example "pending" or "completed" or "failed"
   */
  status: string;
  
  /**
   * Price assigned to the task
   * @example 25
   */
  price: number;
  
  /**
   * Array of processed images (only present when task is completed)
   * @example [{"resolution": "1024", "path": "/output/image_1024.jpg"}]
   */
  images?: { resolution: string, path: string }[];
}
