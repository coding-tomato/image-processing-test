import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';

@Injectable()
export class DownloadAdapter {
  private readonly inputDir = join(process.cwd(), 'input');

  constructor() {
    // Ensure input directory exists
    if (!existsSync(this.inputDir)) {
      mkdirSync(this.inputDir, { recursive: true });
    }
  }

  /**
   * Download a file from URL or return the path if it's already a local file
   * @param path URL or local file path
   * @returns Promise with the absolute path to the file
   */
  async getFilePath(path: string): Promise<string> {
    try {
      // Check if path is a URL
      const url = new URL(path);
      
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return this.downloadFile(url);
      }
      
      // If URL parsing succeeded but it's not http/https, treat as local file
      return this.ensureAbsolutePath(path);
    } catch {
      // Not a valid URL, treat as local path
      return this.ensureAbsolutePath(path);
    }
  }

  /**
   * Download file from URL and save to input directory
   * @param url The URL to download
   * @returns Promise with the absolute path to the downloaded file
   */
  private downloadFile(url: URL): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = basename(url.pathname);
      const outputPath = join(this.inputDir, filename);
      const fileStream = createWriteStream(outputPath);

      const protocol = url.protocol === 'https:' ? https : http;

      protocol.get(url.toString(), (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download file: ${response.statusCode} ${response.statusMessage}`));
          return;
        }

        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve(outputPath);
        });
      }).on('error', (err) => {
        reject(new Error(`Download error: ${err.message}`));
      });
    });
  }

  /**
   * Ensures the given path is absolute and within input directory
   * @param path The file path to check
   * @returns Absolute path to the file
   */
  private ensureAbsolutePath(path: string): string {
    // If path is already absolute and within input dir, return it
    if (path.startsWith(this.inputDir)) {
      return path;
    }

    // If path is relative to input dir, make it absolute
    const absolutePath = path.startsWith('/') 
      ? path 
      : join(this.inputDir, path);

    // Ensure the file is within the input directory
    if (!absolutePath.includes('input/') && !absolutePath.includes('input\\')) {
      return join(this.inputDir, basename(absolutePath));
    }

    return absolutePath;
  }
}
