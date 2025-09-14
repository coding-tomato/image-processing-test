import * as crypto from 'crypto';

/**
 * Utility function to generate MD5 hash from a string
 * @param data The string data to hash
 * @returns MD5 hash as a hexadecimal string
 */
export const generateMd5 = (data: string): string => {
  return crypto.createHash('md5').update(data).digest('hex');
};
