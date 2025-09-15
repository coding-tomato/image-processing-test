/**
 * Application dependency injection tokens
 * 
 * Organized by type and domain to provide better structure and readability
 */
export const Tokens = {
  Repository: {
    Tasks: 'TASK_REPOSITORY',
    Images: 'IMAGE_REPOSITORY',
  },
  Adapter: {
    Sharp: 'SHARP_ADAPTER',
    Download: 'DOWNLOAD_ADAPTER',
  },
};
