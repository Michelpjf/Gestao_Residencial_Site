import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const migrationFilenamePattern = /^\d{3}_[a-z0-9_]+\.sql$/;
const migrationLockId = 69031204;
const defaultMigrationsDirectory = fileURLToPath(new URL('./migrations/', import.meta.url));

const createLedgerSql = `CREATE TABLE IF NOT EXISTS app_schema_migrations (
  filename TEXT PRIMARY KEY,
  checksum CHAR(64) NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`;

function checksum(content) {
  return createHash('sha256').update(content.replaceAll('\r\n', '\n')).digest('hex');
}

async function readMigrations(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const filenames = entries
    .filter((entry) => entry.isFile() && migrationFilenamePattern.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, 'en'));

  return Promise.all(
    filenames.map(async (filename) => {
      const sql = await readFile(join(directory, filename), 'utf8');
      return Object.freeze({ filename, sql, checksum: checksum(sql) });
    }),
  );
}

function validateAppliedMigrations(migrations, appliedRows) {
  const availableByFilename = new Map(migrations.map((migration) => [migration.filename, migration]));

  for (const applied of appliedRows) {
    const available = availableByFilename.get(applied.filename);
    if (!available) {
      throw new Error(`Applied migration is missing from disk: ${applied.filename}`);
    }
    if (available.checksum !== applied.checksum.trim()) {
      throw new Error(`Applied migration checksum changed: ${applied.filename}`);
    }
  }
}

export async function runMigrations({ client, migrationsDirectory = defaultMigrationsDirectory }) {
  const migrations = await readMigrations(migrationsDirectory);
  await client.query('SELECT pg_advisory_lock($1::BIGINT)', [migrationLockId]);

  try {
    await client.query(createLedgerSql);
    const result = await client.query(
      'SELECT filename, checksum FROM app_schema_migrations ORDER BY filename',
    );
    validateAppliedMigrations(migrations, result.rows);

    const appliedFilenames = new Set(result.rows.map((row) => row.filename));
    const newlyApplied = [];

    for (const migration of migrations) {
      if (appliedFilenames.has(migration.filename)) continue;

      await client.query('BEGIN');
      try {
        await client.query(migration.sql);
        await client.query(
          'INSERT INTO app_schema_migrations (filename, checksum) VALUES ($1, $2)',
          [migration.filename, migration.checksum],
        );
        await client.query('COMMIT');
        newlyApplied.push(migration.filename);
      } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(`Migration failed: ${migration.filename}`, { cause: error });
      }
    }

    return Object.freeze({ applied: Object.freeze(newlyApplied) });
  } finally {
    await client.query('SELECT pg_advisory_unlock($1::BIGINT)', [migrationLockId]);
  }
}
