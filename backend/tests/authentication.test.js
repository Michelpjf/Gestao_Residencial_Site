import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createAuthenticate } from '../src/middleware/authenticate.js';
import { errorHandler } from '../src/middleware/error-handler.js';

const AUTH_SUBJECT = '79b54647-32b5-4fe8-ab2d-b89d808d57b4';
const USER_ID = '3f185149-f16e-47a8-8ac3-2c29190f2b50';
const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';

function createProtectedApp({ verifyToken, findActiveByIdentity }) {
  const app = express();
  const authenticate = createAuthenticate({
    identityProvider: 'supabase',
    verifyToken,
    userProfileRepository: { findActiveByIdentity },
  });

  app.get('/protected', authenticate, (req, res) => res.json(req.auth));
  app.use(errorHandler);
  return app;
}

describe('authentication middleware', () => {
  it('rejects a request without a token', async () => {
    const app = createProtectedApp({
      verifyToken: vi.fn(),
      findActiveByIdentity: vi.fn(),
    });

    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTH_TOKEN_MISSING');
  });

  it('rejects an invalid token without exposing verifier details', async () => {
    const app = createProtectedApp({
      verifyToken: vi.fn().mockRejectedValue(new Error('signature details')),
      findActiveByIdentity: vi.fn(),
    });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: { code: 'AUTH_TOKEN_INVALID', message: 'Bearer token is invalid' },
    });
  });

  it('uses the validated subject to load server-side role and scope', async () => {
    const findActiveByIdentity = vi.fn().mockResolvedValue({
      userId: USER_ID,
      role: 'gestor',
      buildingId: BUILDING_ID,
    });
    const app = createProtectedApp({
      verifyToken: vi.fn().mockResolvedValue({
        sub: AUTH_SUBJECT,
        role: 'admin',
        buildingId: 'client-controlled-value',
      }),
      findActiveByIdentity,
    });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      userId: USER_ID,
      role: 'gestor',
      buildingId: BUILDING_ID,
    });
    expect(findActiveByIdentity).toHaveBeenCalledWith({
      provider: 'supabase',
      subject: AUTH_SUBJECT,
    });
  });

  it('rejects a valid token when there is no active application profile', async () => {
    const app = createProtectedApp({
      verifyToken: vi.fn().mockResolvedValue({ sub: AUTH_SUBJECT }),
      findActiveByIdentity: vi.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('PROFILE_NOT_AUTHORIZED');
  });

  it.each([null, 'not-a-uuid'])(
    'rejects a gestor profile with invalid persisted scope: %s',
    async (buildingId) => {
      const app = createProtectedApp({
        verifyToken: vi.fn().mockResolvedValue({ sub: AUTH_SUBJECT }),
        findActiveByIdentity: vi.fn().mockResolvedValue({
          userId: USER_ID,
          role: 'gestor',
          buildingId,
        }),
      });

      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('PROFILE_SCOPE_INVALID');
    },
  );
});
