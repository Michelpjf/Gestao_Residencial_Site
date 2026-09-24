import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';

const USER_ID = '3f185149-f16e-47a8-8ac3-2c29190f2b50';
const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const OTHER_BUILDING_ID = '7f2d9100-46d0-42cd-b854-445af2ddde3e';
const UNIT_ID = '901e6a32-506d-4e27-8dff-fab7e1c4fd92';

function unit() {
  return {
    id: UNIT_ID,
    buildingId: BUILDING_ID,
    identification: '101',
    subdivision: null,
    type: 'quarto',
    status: 'vago',
  };
}

function appFor(role, unitService, buildingId = null) {
  const authenticate = (req, _res, next) => {
    req.auth = Object.freeze({ userId: USER_ID, role, buildingId });
    next();
  };
  return createApp({ authenticate, unitService });
}

describe('units routes and RBAC', () => {
  it.each(['admin', 'gerente', 'gestor', 'financeiro', 'manutencao'])(
    'allows %s to list units under its server-side scope',
    async (role) => {
      const unitService = { list: vi.fn().mockResolvedValue([unit()]) };
      const scopedBuilding = role === 'gestor' ? BUILDING_ID : null;
      const response = await request(appFor(role, unitService, scopedBuilding)).get(
        `/api/buildings/${BUILDING_ID}/units`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: [unit()] });
    },
  );

  it('blocks gestor from requesting another building before the service runs', async () => {
    const unitService = { list: vi.fn() };
    const response = await request(appFor('gestor', unitService, BUILDING_ID))
      .get(`/api/buildings/${OTHER_BUILDING_ID}/units`)
      .query({ role: 'admin', buildingId: BUILDING_ID });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('BUILDING_SCOPE_FORBIDDEN');
    expect(unitService.list).not.toHaveBeenCalled();
  });

  it.each([
    ['admin', 201],
    ['gerente', 201],
    ['gestor', 403],
    ['financeiro', 403],
    ['manutencao', 403],
  ])('enforces create permission for %s', async (role, expectedStatus) => {
    const unitService = { create: vi.fn().mockResolvedValue(unit()) };
    const response = await request(appFor(role, unitService, role === 'gestor' ? BUILDING_ID : null))
      .post(`/api/buildings/${BUILDING_ID}/units`)
      .send({ identification: '101', type: 'quarto' });

    expect(response.status).toBe(expectedStatus);
    expect(unitService.create).toHaveBeenCalledTimes(expectedStatus === 201 ? 1 : 0);
  });

  it('rejects extra fields and invalid unit identifiers', async () => {
    const unitService = { create: vi.fn(), get: vi.fn() };
    const app = appFor('admin', unitService);

    const invalidPayload = await request(app)
      .post(`/api/buildings/${BUILDING_ID}/units`)
      .send({ identification: '101', type: 'quarto', status: 'ocupado' });
    const invalidId = await request(app).get('/api/units/not-a-uuid');

    expect(invalidPayload.status).toBe(400);
    expect(invalidPayload.body.error.code).toBe('UNIT_INPUT_INVALID');
    expect(invalidId.status).toBe(400);
    expect(invalidId.body.error.code).toBe('UNIT_ID_INVALID');
    expect(unitService.create).not.toHaveBeenCalled();
    expect(unitService.get).not.toHaveBeenCalled();
  });

  it('returns detail through the authenticated server context', async () => {
    const unitService = { get: vi.fn().mockResolvedValue(unit()) };
    const response = await request(appFor('gestor', unitService, BUILDING_ID)).get(
      `/api/units/${UNIT_ID}`,
    );

    expect(response.status).toBe(200);
    expect(unitService.get).toHaveBeenCalledWith(UNIT_ID, {
      userId: USER_ID,
      role: 'gestor',
      buildingId: BUILDING_ID,
    });
  });
});
