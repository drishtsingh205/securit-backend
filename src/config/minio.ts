import * as Minio from 'minio';
import { env } from './env';
import { logger } from './logger';

export const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

export async function ensureBucket(): Promise<void> {
  try {
    const exists = await minioClient.bucketExists(env.MINIO_BUCKET);
    if (!exists) {
      await minioClient.makeBucket(env.MINIO_BUCKET, 'us-east-1');
      logger.info({ bucket: env.MINIO_BUCKET }, 'MinIO bucket created');
    } else {
      logger.info({ bucket: env.MINIO_BUCKET }, 'MinIO bucket exists');
    }
  } catch (err) {
    logger.error({ err }, 'Failed to ensure MinIO bucket');
    throw err;
  }
}

export async function uploadObject(
  key: string,
  data: Buffer | string,
  contentType = 'application/json'
): Promise<void> {
  const buffer = typeof data === 'string' ? Buffer.from(data) : data;
  await minioClient.putObject(env.MINIO_BUCKET, key, buffer, buffer.length, {
    'Content-Type': contentType,
  });
  logger.debug({ key }, 'Object uploaded to MinIO');
}

export async function getObject(key: string): Promise<string> {
  const stream = await minioClient.getObject(env.MINIO_BUCKET, key);
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', reject);
  });
}
