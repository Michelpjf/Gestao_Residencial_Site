import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { createBuildingService } from '../src/modules/buildings/buildings.service.js';

const USER_ID = '3f185149-f16e-47a8-8ac3-2c29190f2b50';
const BUILDING_A = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const BUILDING_B = '7f2d9100-46d0-42cd-b854-445af2ddde3e';
const timestamp = '2026-09-12T00:00:00.000Z';

function building(id, name) {
  return { id, name, active: true, createdAt: timestamp, updatedAt: timestamp };
}

const buildings = [building(BUILDING_A, 'Residencial A'), building(BUILDING_B, 'Residencial B')];

function createRepository() {
  return {
    listActive: vi.fn(async ({ buildingId }) =>
      buildings.filter((item) => buildingId === null || item.id === buildingId),
    ),
    create: vi.fn(async ({ name }) => building(BUILDING_A, name)),
    updateName: vi.fn(async ({ id, name }) => building(id, name)),
    deactivate: vi.fn(async (id) => ({ ...building(id, 'Residencial A'), active: false })),
  };
}

function createRbacApp({ role, buildingId = null }, repository = createRepository()) {
  const authenticate = (req, _res, next) => {
    req.auth = Object.freeze({ userId: USER_ID, role, buildingId });
    next();
  };
  return {
    app: createApp({ authenticate, buildingService: createBuildingService(repository) }),
    repository,
  };
}

describe('buildings RBAC integration', () => {
  it('ignores client role and scope values when a gestor lists buildings', async () => {
    const { app, repository } = createRbacApp({ role: 'gestor', buildingId: BUILDING_A });

    const response = await request(app)
      .get('/api/buildings')
      .query({ role: 'admin', buildingId: BUILDING_B })
      .set('x-role', 'admin')
      .set('x-building-id', BUILDING_B);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([buildings[0]]);
    expect(response.body.data).not.toContainEqual(expect.objectContaining({ id: BUILDING_B }));
    expect(repository.listActive).toHaveBeenCalledWith({ buildingId: BUILDING_A });
  });

  it.each([
    ['admin', 2],
    ['gerente', 2],
    ['gestor', 1],
    ['financeiro', 2],
    ['manutencao', 2],
  ])('allows %s to list only the server-defined scope', async (role, expectedCount) => {
    const scope = role === 'gestor' ? BUILDING_A : null;
    const { app } = createRbacApp({ role, buildingId: scope });

    const response = await request(app).get('/api/buildings');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(expectedCount);
  });

  it.each([
    ['admin', 201],
    ['gerente', 201],
    ['gestor', 403],
    ['financeiro', 403],
    ['manutencao', 403],
  ])('enforces create permission for %s', async (role, expectedStatus) => {
    const { app, repository } = createRbacApp({
      role,
      buildingId: role === 'gestor' ? BUILDING_A : null,
    });

    const response = await request(app)
      .post('/api/buildings')
      .set('x-role', 'admin')
      .send({ name: 'Residencial Novo' });

    expect(response.status).toBe(expectedStatus);
    expect(repository.create).toHaveBeenCalledTimes(expectedStatus === 201 ? 1 : 0);
  });

  it('does not allow a gestor to elevate access through request body fields', async () => {
    const { app, repository } = createRbacApp({ role: 'gestor', buildingId: BUILDING_A });

    const response = await request(app).post('/api/buildings').send({
      name: 'Residencial Novo',
      role: 'admin',
      buildingId: BUILDING_B,
    });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('ROLE_FORBIDDEN');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it.each([
    ['admin', 200],
    ['gerente', 200],
    ['gestor', 403],
    ['financeiro', 403],
    ['manutencao', 403],
  ])('enforces update permission for %s', async (role, expectedStatus) => {
    const { app, repository } = createRbacApp({
      role,
      buildingId: role === 'gestor' ? BUILDING_A : null,
    });

    const response = await request(app)
      .patch(`/api/buildings/${BUILDING_B}`)
      .query({ buildingId: BUILDING_B })
      .set('x-role', 'admin')
      .send({ name: 'Residencial Alterado' });

    expect(response.status).toBe(expectedStatus);
    expect(repository.updateName).toHaveBeenCalledTimes(expectedStatus === 200 ? 1 : 0);
  });

  it.each([
    ['admin', 200],
    ['gerente', 403],
    ['gestor', 403],
    ['financeiro', 403],
    ['manutencao', 403],
  ])('enforces deactivate permission for %s', async (role, expectedStatus) => {
    const { app, repository } = createRbacApp({
      role,
      buildingId: role === 'gestor' ? BUILDING_A : null,
    });

    const response = await request(app)
      .delete(`/api/buildings/${BUILDING_B}`)
      .set('x-role', 'admin')
      .set('x-building-id', BUILDING_B);

    expect(response.status).toBe(expectedStatus);
    expect(repository.deactivate).toHaveBeenCalledTimes(expectedStatus === 200 ? 1 : 0);
  });

  it('rejects a gestor without scope before querying the repository', async () => {
    const { app, repository } = createRbacApp({ role: 'gestor' });

    const response = await request(app)
      .get('/api/buildings')
      .query({ buildingId: BUILDING_B })
      .set('x-building-id', BUILDING_B);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('PROFILE_SCOPE_INVALID');
    expect(repository.listActive).not.toHaveBeenCalled();
  });

  it('rejects non-business technical roles on every buildings operation', async () => {
    const { app, repository } = createRbacApp({ role: 'developer' });

    const responses = await Promise.all([
      request(app).get('/api/buildings'),
      request(app).post('/api/buildings').send({ name: 'Residencial Novo' }),
      request(app).patch(`/api/buildings/${BUILDING_A}`).send({ name: 'Outro nome' }),
      request(app).delete(`/api/buildings/${BUILDING_A}`),
    ]);

    expect(responses.map(({ status }) => status)).toEqual([403, 403, 403, 403]);
    expect(repository.listActive).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.updateName).not.toHaveBeenCalled();
    expect(repository.deactivate).not.toHaveBeenCalled();
  });
});
