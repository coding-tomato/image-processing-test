import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
import { createHash } from 'crypto';
import { RESOLUTIONS } from 'src/tasks/domain/image.entity';
import { ImageVariant, ImageProcessingRepository } from 'src/tasks/domain/image-processing.repository';

export const generateMd5 = (data: string): string => {
  return createHash('md5').update(data).digest('hex');
};

/**
 * Sharp adapter for image processing
 * 
 * This class uses the Sharp library to process images and generate different variants.
 */
export class SharpAdapter implements ImageProcessingRepository {
  /**
   * Generate image variants with different resolutions
   * @param originalPath Path to the original image
   * @returns Promise resolving to an array of image variants
   */
  async generateVariants(originalPath: string): Promise<ImageVariant[]> {
    try {
      // Extract file information
      const fileExt = path.extname(originalPath);
      const fileName = path.basename(originalPath, fileExt);
      
      // Load the image using sharp
      const image = sharp(originalPath);
      const variants: ImageVariant[] = [];
      
      // Create output directory structure if it doesn't exist
      const outputBaseDir = path.join(process.cwd(), 'output', fileName);
      await fs.mkdir(outputBaseDir, { recursive: true });
      
      for (const resolution of RESOLUTIONS) {
        const md5Hash = generateMd5(`${fileName}_${resolution}_${Date.now()}`);
        
        const outputPath = path.join(outputBaseDir, resolution, `${md5Hash}${fileExt}`);
        const urlPath = `/images/${fileName}/${resolution}/${md5Hash}${fileExt}`;
        
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        await image
          .clone()
          .resize({
            width: parseInt(resolution),
            withoutEnlargement: true,
            fit: 'inside',
          })
          .toFile(outputPath);
        
        variants.push({
          resolution,
          path: urlPath, // URL path for API responses
          md5: md5Hash,
        });
      }

      return variants;
    } catch (error) {
      throw new Error(`Failed to generate image variants: ${error.message}`);
    }
  }
}
