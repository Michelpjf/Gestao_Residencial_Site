import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';

const ADMIN_ID = '3f185149-f16e-47a8-8ac3-2c29190f2b50';
const MANAGER_ID = '79b54647-32b5-4fe8-ab2d-b89d808d57b4';
const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';

const assignment = {
  userId: MANAGER_ID,
  displayName: 'Gestor Bueno',
  building: { id: BUILDING_ID, name: 'Residencial Bueno' },
  updatedAt: '2026-09-28T00:00:00.000Z',
};

function appFor(role, adminAccessService) {
  const authenticate = (req, _res, next) => {
    req.auth = { userId: ADMIN_ID, role, buildingId: null };
    next();
  };
  return createApp({ authenticate, adminAccessService });
}

describe('admin access routes', () => {
  it('allows admin to list persisted manager assignments', async () => {
    const service = { listManagers: vi.fn().mockResolvedValue([assignment]) };
    const response = await request(appFor('admin', service)).get('/api/admin/manager-assignments');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [assignment] });
  });

  it('allows the read-only admin role only this explicit administrative mutation', async () => {
    const service = { assignManager: vi.fn().mockResolvedValue(assignment) };
    const response = await request(appFor('admin', service))
      .patch(`/api/admin/manager-assignments/${MANAGER_ID}`)
      .send({ displayName: '  Gestor Bueno  ', buildingId: BUILDING_ID });

    expect(response.status).toBe(200);
    expect(service.assignManager).toHaveBeenCalledWith(
      MANAGER_ID,
      { displayName: 'Gestor Bueno', buildingId: BUILDING_ID },
      ADMIN_ID,
    );
  });

  it.each(['gerente', 'gestor', 'financeiro', 'manutencao'])(
    'blocks %s from manager assignments',
    async (role) => {
      const service = { listManagers: vi.fn(), assignManager: vi.fn() };
      const response = await request(appFor(role, service)).get('/api/admin/manager-assignments');
      expect(response.status).toBe(403);
      expect(service.listManagers).not.toHaveBeenCalled();
    },
  );

  it('rejects unknown assignment fields', async () => {
    const service = { assignManager: vi.fn() };
    const response = await request(appFor('admin', service))
      .patch(`/api/admin/manager-assignments/${MANAGER_ID}`)
      .send({ displayName: 'Gestor Bueno', buildingId: BUILDING_ID, role: 'admin' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('MANAGER_ASSIGNMENT_INVALID');
    expect(service.assignManager).not.toHaveBeenCalled();
  });
});
