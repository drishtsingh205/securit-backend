import { Pool, PoolConfig } from 'pg';
import { env } from './env';
import { logger } from './logger';

const poolConfig: PoolConfig = {
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  logger.debug('PostgreSQL client connected');
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected PostgreSQL pool error');
});

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  logger.debug({ text: text.substring(0, 80), duration, rows: result.rowCount }, 'Query executed');
  return result.rows as T[];
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function testConnection(): Promise<void> {
  try {
    await pool.query('SELECT NOW()');
    logger.info('PostgreSQL connection established');
  } catch (err) {
    logger.error({ err }, 'Failed to connect to PostgreSQL');
    throw err;
  }
}
