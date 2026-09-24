import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';

const USER_ID = '3f185149-f16e-47a8-8ac3-2c29190f2b50';
const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const UNIT_ID = '901e6a32-506d-4e27-8dff-fab7e1c4fd92';
const TENANT_ID = '7f2d9100-46d0-42cd-b854-445af2ddde3e';
const validInput = {
  unitId: UNIT_ID, fullName: 'Pessoa Fictícia', cpf: '529.982.247-25', rg: '123456 SSP/GO', birthDate: '1990-05-10',
  maritalStatus: 'Solteiro', addressGoiania: 'Rua Fictícia, 10', addressOrigin: 'Rua de Origem, 20', phone: '(62) 99999-0000',
  referenceOneName: 'Referência Um', referenceOnePhone: '(62) 99999-0001', referenceTwoName: 'Referência Dois', referenceTwoPhone: '(62) 99999-0002',
};
const tenant = { id: TENANT_ID, ...validInput, cpf: '52998224725', buildingId: BUILDING_ID };

function appFor(role, tenantService, buildingId = null) {
  const authenticate = (req, _res, next) => { req.auth = Object.freeze({ userId: USER_ID, role, buildingId }); next(); };
  return createApp({ authenticate, tenantService });
}

describe('tenant routes and RBAC', () => {
  it.each(['admin', 'gerente', 'gestor'])('allows %s to list, create and read tenants', async (role) => {
    const tenantService = { list: vi.fn().mockResolvedValue([tenant]), create: vi.fn().mockResolvedValue(tenant), get: vi.fn().mockResolvedValue(tenant) };
    const app = appFor(role, tenantService, role === 'gestor' ? BUILDING_ID : null);
    expect((await request(app).get('/api/tenants')).status).toBe(200);
    expect((await request(app).post('/api/tenants').send(validInput)).status).toBe(201);
    expect((await request(app).get(`/api/tenants/${TENANT_ID}`)).status).toBe(200);
    expect(tenantService.create.mock.calls[0][0].cpf).toBe('52998224725');
  });

  it.each(['financeiro', 'manutencao'])('denies direct tenant access to %s', async (role) => {
    const tenantService = { list: vi.fn(), create: vi.fn(), get: vi.fn() };
    const app = appFor(role, tenantService);
    expect((await request(app).get('/api/tenants')).status).toBe(403);
    expect((await request(app).post('/api/tenants').send(validInput)).status).toBe(403);
    expect((await request(app).get(`/api/tenants/${TENANT_ID}`)).status).toBe(403);
    expect(tenantService.list).not.toHaveBeenCalled();
  });

  it('rejects invalid CPF, future birth dates, extra fields and malformed ids', async () => {
    const tenantService = { create: vi.fn(), get: vi.fn() };
    const app = appFor('admin', tenantService);
    for (const invalid of [
      { ...validInput, cpf: '111.111.111-11' },
      { ...validInput, cpf: 'abc529.982.247-25' },
      { ...validInput, birthDate: '2999-01-01' },
      { ...validInput, buildingId: BUILDING_ID },
    ]) {
      const response = await request(app).post('/api/tenants').send(invalid);
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('TENANT_INPUT_INVALID');
    }
    const badId = await request(app).get('/api/tenants/not-a-uuid');
    expect(badId.status).toBe(400);
    expect(badId.body.error.code).toBe('TENANT_ID_INVALID');
    expect(tenantService.create).not.toHaveBeenCalled();
  });
});
