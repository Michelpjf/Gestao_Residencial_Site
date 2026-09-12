import 'dotenv/config';
import { loadDatabaseConfig } from '../config/env.js';
import { createDatabasePool } from './pool.js';
import { runMigrations } from './migration-runner.js';

const pool = createDatabasePool(loadDatabaseConfig());
let client;

try {
  client = await pool.connect();
  const result = await runMigrations({ client });
  const summary = result.applied.length > 0 ? result.applied.join(', ') : 'database already current';
  console.info(`Migrations complete: ${summary}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Migration failed');
  process.exitCode = 1;
} finally {
  client?.release();
  await pool.end();
}
