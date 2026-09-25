import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })));
});

describe('same-origin frontend', () => {
  it('serves the static frontend while keeping unknown API routes as JSON 404s', async () => {
    const staticDir = await mkdtemp(path.join(tmpdir(), 'bueno-frontend-'));
    temporaryDirectories.push(staticDir);
    await writeFile(path.join(staticDir, 'index.html'), '<!doctype html><title>Bueno</title>');

    const app = createApp({
      staticDir,
      supabaseUrl: 'https://example.supabase.co',
      supabasePublishableKey: 'sb_publishable_example',
    });
    const frontend = await request(app).get('/');
    const runtimeConfig = await request(app).get('/config.js');
    const missingApi = await request(app).get('/api/not-a-route');

    expect(frontend.status).toBe(200);
    expect(frontend.text).toContain('<title>Bueno</title>');
    expect(frontend.headers['content-security-policy']).toContain("default-src 'self'");
    expect(frontend.headers['content-security-policy']).toContain('https://example.supabase.co');
    expect(runtimeConfig.status).toBe(200);
    expect(runtimeConfig.headers['cache-control']).toBe('no-store');
    expect(runtimeConfig.text).toContain('https://example.supabase.co');
    expect(runtimeConfig.text).toContain('sb_publishable_example');
    expect(runtimeConfig.text).not.toContain('DATABASE_URL');
    expect(missingApi.status).toBe(404);
    expect(missingApi.body.error.code).toBe('ROUTE_NOT_FOUND');
  });
});
