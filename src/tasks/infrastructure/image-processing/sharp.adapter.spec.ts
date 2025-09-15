import * as fs from 'fs/promises';
import * as path from 'path';
import { SharpAdapter } from './sharp.adapter';
import { RESOLUTIONS } from '../../../shared/common/constants/resolutions.constant';

process.env.NODE_ENV = 'test';

describe('SharpAdapter', () => {
  let sharpAdapter: SharpAdapter;
  let originalImagePath: string;
  
  beforeAll(() => {
    sharpAdapter = new SharpAdapter();
    // Point to the sample image in the input folder
    originalImagePath = path.join(process.cwd(), 'input', 'test_image.jpeg');
  });
  
  afterAll(async () => {
    // Clean up test output directories if needed
    try {
      const fileName = path.basename(originalImagePath, path.extname(originalImagePath));
      const outputDir = path.join(process.cwd(), 'output', fileName);
      await fs.rm(outputDir, { recursive: true, force: true });
      
      // Also clean up any non-image file directory created for tests
      const nonImageDir = path.join(process.cwd(), 'output', 'non-image-file');
      await fs.rm(nonImageDir, { recursive: true, force: true }).catch(() => {});
    } catch (err) {
      console.error('Error cleaning up test output:', err);
    }
  });

  it('should generate image variants for different resolutions', async () => {
    // Check if the original image exists before proceeding
    const imageExists = await fs.access(originalImagePath)
      .then(() => true)
      .catch(() => false);
    
    if (!imageExists) {
      console.log('Test image not available, skipping test.');
      return;
    }

    // Generate variants
    const variants = await sharpAdapter.generateVariants(originalImagePath);
    
    // Verify results
    expect(variants).toBeDefined();
    expect(variants.length).toEqual(RESOLUTIONS.length);
    
    // Check each variant
    for (const variant of variants) {
      // Ensure each variant has the expected properties
      expect(variant.resolution).toBeDefined();
      expect(variant.path).toBeDefined();
      expect(variant.md5).toBeDefined();
      
      // Ensure the resolution matches one from our constants
      expect(RESOLUTIONS).toContain(variant.resolution);
      
      // Ensure the output file exists - convert URL path to filesystem path
      const fileName = path.basename(originalImagePath, path.extname(originalImagePath));
      const outputBaseDir = path.join(process.cwd(), 'output', fileName);
      const pathParts = variant.path.split('/');
      const resolution = pathParts[pathParts.length - 2];
      const outputFileName = pathParts[pathParts.length - 1];
      const outputFilePath = path.join(outputBaseDir, resolution, outputFileName);
      
      const fileExists = await fs.access(outputFilePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    }
  });

  it('should throw error when processing invalid image', async () => {
    // Create a directory for our non-image file
    const nonImageDir = path.join(process.cwd(), 'output', 'non-image-file');
    await fs.mkdir(nonImageDir, { recursive: true });
    
    // Create a non-image file for testing error handling
    const invalidImagePath = path.join(nonImageDir, 'not-an-image.txt');
    await fs.writeFile(invalidImagePath, 'This is not an image');
    
    // The adapter should throw an error when processing a non-image file
    await expect(sharpAdapter.generateVariants(invalidImagePath)).rejects.toThrow();
  });
});
