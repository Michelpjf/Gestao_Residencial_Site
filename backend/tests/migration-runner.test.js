import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { runMigrations } from '../src/db/migration-runner.js';

const temporaryDirectories = [];

async function createMigrations(files) {
  const directory = await mkdtemp(join(tmpdir(), 'bueno-migrations-'));
  temporaryDirectories.push(directory);
  await Promise.all(
    Object.entries(files).map(([filename, content]) =>
      writeFile(join(directory, filename), content, 'utf8'),
    ),
  );
  return directory;
}

function createClient({ failOnSql } = {}) {
  const applied = new Map();
  const statements = [];

  return {
    applied,
    statements,
    async query(sql, parameters = []) {
      statements.push(sql);
      if (sql === failOnSql) throw new Error('database rejected migration');
      if (sql.startsWith('SELECT filename, checksum')) {
        return {
          rows: [...applied].map(([filename, storedChecksum]) => ({
            filename,
            checksum: storedChecksum,
          })),
        };
      }
      if (sql.startsWith('INSERT INTO app_schema_migrations')) {
        applied.set(parameters[0], parameters[1]);
      }
      return { rows: [] };
    },
  };
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

describe('migration runner', () => {
  it('applies numbered migrations in order and skips them on the second run', async () => {
    const directory = await createMigrations({
      '002_second.sql': 'SELECT 2;',
      '001_first.sql': 'SELECT 1;',
      'notes.txt': 'ignored',
    });
    const client = createClient();

    await expect(runMigrations({ client, migrationsDirectory: directory })).resolves.toEqual({
      applied: ['001_first.sql', '002_second.sql'],
    });
    await expect(runMigrations({ client, migrationsDirectory: directory })).resolves.toEqual({
      applied: [],
    });
    expect(client.statements.filter((statement) => statement === 'SELECT 1;')).toHaveLength(1);
    expect(client.statements.filter((statement) => statement === 'SELECT 2;')).toHaveLength(1);
  });

  it('rejects a changed migration that was already applied', async () => {
    const directory = await createMigrations({ '001_first.sql': 'SELECT 1;' });
    const client = createClient();
    await runMigrations({ client, migrationsDirectory: directory });
    await writeFile(join(directory, '001_first.sql'), 'SELECT 999;', 'utf8');

    await expect(runMigrations({ client, migrationsDirectory: directory })).rejects.toThrow(
      'Applied migration checksum changed: 001_first.sql',
    );
  });

  it('treats Windows and Unix line endings as the same migration content', async () => {
    const directory = await createMigrations({ '001_first.sql': 'SELECT 1;\r\nSELECT 2;\r\n' });
    const client = createClient();
    await runMigrations({ client, migrationsDirectory: directory });
    await writeFile(join(directory, '001_first.sql'), 'SELECT 1;\nSELECT 2;\n', 'utf8');

    await expect(runMigrations({ client, migrationsDirectory: directory })).resolves.toEqual({
      applied: [],
    });
  });

  it('rejects an applied migration that is missing from disk', async () => {
    const directory = await createMigrations({ '001_first.sql': 'SELECT 1;' });
    const client = createClient();
    await runMigrations({ client, migrationsDirectory: directory });
    await rm(join(directory, '001_first.sql'));

    await expect(runMigrations({ client, migrationsDirectory: directory })).rejects.toThrow(
      'Applied migration is missing from disk: 001_first.sql',
    );
  });

  it('rolls back a failed migration and always releases the advisory lock', async () => {
    const directory = await createMigrations({ '001_first.sql': 'INVALID SQL;' });
    const client = createClient({ failOnSql: 'INVALID SQL;' });

    await expect(runMigrations({ client, migrationsDirectory: directory })).rejects.toThrow(
      'Migration failed: 001_first.sql',
    );
    expect(client.statements).toContain('ROLLBACK');
    expect(client.statements.at(-1)).toBe('SELECT pg_advisory_unlock($1::BIGINT)');
  });
});
