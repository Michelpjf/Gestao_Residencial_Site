import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('GET /health', () => {
  it('returns a minimal liveness response', async () => {
    const response = await request(createApp()).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('can expose the authenticated server context without domain routes', async () => {
    const authenticate = (req, _res, next) => {
      req.auth = {
        userId: '79b54647-32b5-4fe8-ab2d-b89d808d57b4',
        role: 'admin',
        buildingId: null,
      };
      next();
    };
    const response = await request(createApp({ authenticate })).get('/api/auth/context');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      userId: '79b54647-32b5-4fe8-ab2d-b89d808d57b4',
      role: 'admin',
      buildingId: null,
    });
  });
});
