import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';

const USER_ID = '3f185149-f16e-47a8-8ac3-2c29190f2b50';
const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';

function building(overrides = {}) {
  return {
    id: BUILDING_ID,
    name: 'Residencial Bueno',
    active: true,
    createdAt: '2026-09-12T00:00:00.000Z',
    updatedAt: '2026-09-12T00:00:00.000Z',
    ...overrides,
  };
}

function createTestApp(role, buildingService, buildingId = null) {
  const authenticate = (req, _res, next) => {
    req.auth = { userId: USER_ID, role, buildingId };
    next();
  };
  return createApp({ authenticate, buildingService });
}

describe('buildings routes', () => {
  it('lists active buildings for an authenticated business role', async () => {
    const buildingService = { list: vi.fn().mockResolvedValue([building()]) };
    const response = await request(createTestApp('gestor', buildingService, BUILDING_ID)).get(
      '/api/buildings',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [building()] });
    expect(buildingService.list).toHaveBeenCalledWith({
      userId: USER_ID,
      role: 'gestor',
      buildingId: BUILDING_ID,
    });
  });

  it('allows gerente to create a building with normalized input', async () => {
    const buildingService = { create: vi.fn().mockResolvedValue(building()) };
    const response = await request(createTestApp('gerente', buildingService))
      .post('/api/buildings')
      .send({ name: '  Residencial Bueno  ' });

    expect(response.status).toBe(201);
    expect(response.headers.location).toBe(`/api/buildings/${BUILDING_ID}`);
    expect(buildingService.create).toHaveBeenCalledWith({ name: 'Residencial Bueno' });
  });

  it('blocks gestor from creating a building', async () => {
    const buildingService = { create: vi.fn() };
    const response = await request(createTestApp('gestor', buildingService, BUILDING_ID))
      .post('/api/buildings')
      .send({ name: 'Residencial Bueno' });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('ROLE_FORBIDDEN');
    expect(buildingService.create).not.toHaveBeenCalled();
  });

  it('rejects unknown input fields', async () => {
    const buildingService = { create: vi.fn() };
    const response = await request(createTestApp('admin', buildingService))
      .post('/api/buildings')
      .send({ name: 'Residencial Bueno', active: false });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('BUILDING_INPUT_INVALID');
    expect(buildingService.create).not.toHaveBeenCalled();
  });

  it('rejects an invalid building id before updating', async () => {
    const buildingService = { update: vi.fn() };
    const response = await request(createTestApp('admin', buildingService))
      .patch('/api/buildings/not-a-uuid')
      .send({ name: 'Residencial Bueno' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('BUILDING_ID_INVALID');
    expect(buildingService.update).not.toHaveBeenCalled();
  });

  it('allows only admin to deactivate a building', async () => {
    const gerenteService = { deactivate: vi.fn() };
    const forbidden = await request(createTestApp('gerente', gerenteService)).delete(
      `/api/buildings/${BUILDING_ID}`,
    );
    expect(forbidden.status).toBe(403);
    expect(gerenteService.deactivate).not.toHaveBeenCalled();

    const adminService = {
      deactivate: vi.fn().mockResolvedValue(building({ active: false })),
    };
    const allowed = await request(createTestApp('admin', adminService)).delete(
      `/api/buildings/${BUILDING_ID}`,
    );
    expect(allowed.status).toBe(200);
    expect(allowed.body.data.active).toBe(false);
  });
});
