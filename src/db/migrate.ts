import { readFileSync } from 'fs';
import path from 'path';
import { pool } from '../config/database';
import { logger } from '../config/logger';

async function migrate(): Promise<void> {
  logger.info('Starting database migration...');

  try {
    // Create migrations tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = ['001_initial_schema.sql'];

    for (const file of migrationFiles) {
      // Check if already executed
      const result = await pool.query(
        'SELECT id FROM schema_migrations WHERE filename = $1',
        [file]
      );

      if (result.rows.length > 0) {
        logger.info({ file }, 'Migration already applied, skipping');
        continue;
      }

      const sql = readFileSync(path.join(migrationsDir, file), 'utf-8');
      await pool.query(sql);
      await pool.query(
        'INSERT INTO schema_migrations (filename) VALUES ($1)',
        [file]
      );

      logger.info({ file }, 'Migration applied successfully');
    }

    logger.info('All migrations completed');
  } catch (err) {
    logger.error({ err }, 'Migration failed');
    throw err;
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
