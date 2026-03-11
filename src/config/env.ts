import dotenv from 'dotenv';
dotenv.config();

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || '0.0.0.0',
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.privacylens.io/v1',

  // PostgreSQL
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  POSTGRES_DB: process.env.POSTGRES_DB || 'privacylens',
  POSTGRES_USER: process.env.POSTGRES_USER || 'privacylens',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'privacylens_dev',

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_in_production',
  JWT_ACCESS_EXPIRY: parseInt(process.env.JWT_ACCESS_EXPIRY || '86400', 10),
  JWT_REFRESH_EXPIRY: parseInt(process.env.JWT_REFRESH_EXPIRY || '604800', 10),

  // MinIO
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
  MINIO_PORT: parseInt(process.env.MINIO_PORT || '9000', 10),
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin',
  MINIO_BUCKET: process.env.MINIO_BUCKET || 'privacylens-reports',
  MINIO_USE_SSL: process.env.MINIO_USE_SSL === 'true',

  // Rate Limiting
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
