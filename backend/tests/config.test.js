import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config/env.js';

const requiredEnvironment = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/bueno_residence',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example',
};

describe('environment configuration', () => {
  it('loads safe defaults and groups service configuration', () => {
    const config = loadConfig(requiredEnvironment);

    expect(config.port).toBe(3000);
    expect(config.trustProxy).toBe(false);
    expect(config.database.ssl).toBe(false);
    expect(config.supabase).toEqual({
      url: 'https://example.supabase.co',
      publishableKey: 'sb_publishable_example',
      audience: 'authenticated',
    });
  });

  it('requires the PostgreSQL connection string', () => {
    expect(() => loadConfig({ SUPABASE_URL: requiredEnvironment.SUPABASE_URL })).toThrow(
      /DATABASE_URL/,
    );
  });

  it('requires HTTPS for the Supabase project URL', () => {
    expect(() =>
      loadConfig({ ...requiredEnvironment, SUPABASE_URL: 'http://example.supabase.co' }),
    ).toThrow(/SUPABASE_URL/);
  });
});
