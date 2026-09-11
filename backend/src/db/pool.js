import pg from 'pg';

const { Pool } = pg;

export function createDatabasePool(config) {
  return new Pool({
    connectionString: config.connectionString,
    max: config.poolMax,
    ssl: config.ssl,
  });
}
