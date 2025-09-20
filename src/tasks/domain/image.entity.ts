export const RESOLUTIONS = ["1024", "800"] as const;
export type SupportedResolutions = typeof RESOLUTIONS[number];

/**
 * Interface for image information in a task
 */
export interface Image {
  resolution: SupportedResolutions;
  path: string;
}