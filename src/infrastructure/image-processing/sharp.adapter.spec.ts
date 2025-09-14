import * as fs from 'fs/promises';
import * as path from 'path';
import { SharpAdapter } from './sharp.adapter';
import { RESOLUTIONS } from '../../common/constants/resolutions.constant';

describe('SharpAdapter', () => {
  let sharpAdapter: SharpAdapter;
  let originalImagePath: string;
  
  beforeAll(() => {
    sharpAdapter = new SharpAdapter();
    // Point to the sample image in the input folder
    originalImagePath = path.join(process.cwd(), 'input', 'Lionel_Messi_20180626.jpg');
  });
  
  afterAll(async () => {
    // Clean up test output directories if needed
    try {
      const fileName = path.basename(originalImagePath, path.extname(originalImagePath));
      const outputDir = path.join(process.cwd(), 'output', fileName);
      await fs.rm(outputDir, { recursive: true, force: true });
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
      
      // Ensure the output file exists
      const fileExists = await fs.access(variant.path)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    }
  });

  it('should throw error when processing invalid image', async () => {
    // Create a non-image file for testing error handling
    const invalidImagePath = path.join(process.cwd(), 'output', 'non-image-file.txt');
    await fs.writeFile(invalidImagePath, 'This is not an image');
    
    try {
      await expect(sharpAdapter.generateVariants(invalidImagePath)).rejects.toThrow();
    } finally {
      // Clean up the test file
      await fs.unlink(invalidImagePath);
    }
  });
});
