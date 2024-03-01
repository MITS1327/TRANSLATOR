import { type Readable } from 'stream';

export const concatStream = <T = unknown>(stream: Readable): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const chunks: T[] = [];
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    stream.on('error', (error) => {
      reject(error);
    });
    stream.on('end', () => {
      resolve(chunks);
    });
  });
};
