import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';

const USER_ID = '3f185149-f16e-47a8-8ac3-2c29190f2b50';
const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const TENANT_ID = '901e6a32-506d-4e27-8dff-fab7e1c4fd92';
const CONTRACT_ID = '7f2d9100-46d0-42cd-b854-445af2ddde3e';
const input = { tenantId: TENANT_ID, rentAmount: '1250.50', termMonths: 3, startDate: '2026-10-01', endDate: '2027-01-01' };
const contract = { id: CONTRACT_ID, contractNumber: 1, ...input };

function appFor(role, contractService, buildingId = null) {
  const authenticate = (req, _res, next) => { req.auth = Object.freeze({ userId: USER_ID, role, buildingId }); next(); };
  return createApp({ authenticate, contractService });
}

describe('contract routes and RBAC', () => {
  it.each(['admin', 'gerente', 'gestor'])('allows %s to create, list, read and download', async (role) => {
    const contractService = { list: vi.fn().mockResolvedValue([contract]), create: vi.fn().mockResolvedValue(contract), get: vi.fn().mockResolvedValue(contract), document: vi.fn().mockResolvedValue({ buffer: Buffer.from('docx'), filename: 'contrato.docx' }) };
    const app = appFor(role, contractService, role === 'gestor' ? BUILDING_ID : null);
    expect((await request(app).get('/api/contracts')).status).toBe(200);
    expect((await request(app).post('/api/contracts').send(input)).status).toBe(201);
    expect((await request(app).get(`/api/contracts/${CONTRACT_ID}`)).status).toBe(200);
    const document = await request(app).get(`/api/contracts/${CONTRACT_ID}/document`);
    expect(document.status).toBe(200);
    expect(document.headers['content-type']).toContain('application/vnd.openxmlformats');
    expect(document.headers['content-disposition']).toBe('attachment; filename="contrato.docx"');
    expect(document.headers['cache-control']).toBe('no-store');
  });

  it('allows Financeiro only to read and download', async () => {
    const contractService = { list: vi.fn().mockResolvedValue([]), create: vi.fn(), get: vi.fn().mockResolvedValue(contract), document: vi.fn().mockResolvedValue({ buffer: Buffer.from('docx'), filename: 'contrato.docx' }) };
    const app = appFor('financeiro', contractService);
    expect((await request(app).get('/api/contracts')).status).toBe(200);
    expect((await request(app).get(`/api/contracts/${CONTRACT_ID}`)).status).toBe(200);
    expect((await request(app).get(`/api/contracts/${CONTRACT_ID}/document`)).status).toBe(200);
    expect((await request(app).post('/api/contracts').send(input)).status).toBe(403);
    expect(contractService.create).not.toHaveBeenCalled();
  });

  it('denies every contract operation to Maintenance', async () => {
    const contractService = { list: vi.fn(), create: vi.fn(), get: vi.fn(), document: vi.fn() };
    const app = appFor('manutencao', contractService);
    expect((await request(app).get('/api/contracts')).status).toBe(403);
    expect((await request(app).post('/api/contracts').send(input)).status).toBe(403);
    expect((await request(app).get(`/api/contracts/${CONTRACT_ID}`)).status).toBe(403);
    expect((await request(app).get(`/api/contracts/${CONTRACT_ID}/document`)).status).toBe(403);
  });

  it('rejects invalid values, date ranges, extra fields and ids', async () => {
    const contractService = { create: vi.fn(), get: vi.fn() };
    const app = appFor('admin', contractService);
    for (const invalid of [
      { ...input, rentAmount: '0.00' }, { ...input, rentAmount: 1250.5 }, { ...input, termMonths: 0 },
      { ...input, endDate: input.startDate }, { ...input, buildingId: BUILDING_ID },
    ]) expect((await request(app).post('/api/contracts').send(invalid)).status).toBe(400);
    const badId = await request(app).get('/api/contracts/not-a-uuid');
    expect(badId.status).toBe(400);
    expect(badId.body.error.code).toBe('CONTRACT_ID_INVALID');
    expect(contractService.create).not.toHaveBeenCalled();
  });
});
