import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { requireRoles } from '../src/middleware/authorize.js';
import { requireBuildingAccess } from '../src/middleware/building-scope.js';
import { errorHandler } from '../src/middleware/error-handler.js';

const BUILDING_A = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const BUILDING_B = '7f2d9100-46d0-42cd-b854-445af2ddde3e';

function createAuthorizationApp(auth) {
  const app = express();
  app.use((req, _res, next) => {
    req.auth = auth;
    next();
  });
  app.get('/admin', requireRoles('admin'), (_req, res) => res.sendStatus(204));
  app.get(
    '/buildings/:buildingId',
    requireRoles('admin', 'gerente', 'gestor'),
    requireBuildingAccess(),
    (_req, res) => res.sendStatus(204),
  );
  app.use(errorHandler);
  return app;
}

describe('role authorization', () => {
  it('allows an explicitly configured role', async () => {
    const response = await request(createAuthorizationApp({ role: 'admin' })).get('/admin');
    expect(response.status).toBe(204);
  });

  it('blocks a role that is not configured for the route', async () => {
    const response = await request(createAuthorizationApp({ role: 'financeiro' })).get('/admin');
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('ROLE_FORBIDDEN');
  });
});

describe('building scope authorization', () => {
  it('allows a gestor to access the persisted building scope', async () => {
    const app = createAuthorizationApp({ role: 'gestor', buildingId: BUILDING_A });
    const response = await request(app).get(`/buildings/${BUILDING_A}`);
    expect(response.status).toBe(204);
  });

  it('blocks a gestor from another building', async () => {
    const app = createAuthorizationApp({ role: 'gestor', buildingId: BUILDING_A });
    const response = await request(app).get(`/buildings/${BUILDING_B}`);
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('BUILDING_SCOPE_FORBIDDEN');
  });

  it('allows a global role after validating the building id', async () => {
    const response = await request(createAuthorizationApp({ role: 'gerente' })).get(
      `/buildings/${BUILDING_B}`,
    );
    expect(response.status).toBe(204);
  });

  it('rejects an invalid building id before authorization', async () => {
    const response = await request(createAuthorizationApp({ role: 'admin' })).get(
      '/buildings/not-a-uuid',
    );
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('BUILDING_ID_INVALID');
  });
});
