import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';

const USER_ID = '3f185149-f16e-47a8-8ac3-2c29190f2b50';
const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';

function appFor(role, reportService, buildingId = null) {
  const authenticate = (req, _res, next) => {
    req.auth = Object.freeze({ userId: USER_ID, role, buildingId });
    next();
  };
  return createApp({ authenticate, reportService });
}

describe('essential report route and RBAC', () => {
  it.each(['admin', 'gerente', 'gestor', 'financeiro'])('allows %s to read the report', async (role) => {
    const data = { summary: { activeBuildings: 1, units: 0, tenants: 0, contracts: 0 }, rows: [] };
    const reportService = { essential: vi.fn().mockResolvedValue(data) };
    const response = await request(appFor(role, reportService, role === 'gestor' ? BUILDING_ID : null))
      .get('/api/reports/essential');
    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.body).toEqual({ data });
    expect(reportService.essential).toHaveBeenCalledWith(expect.objectContaining({ role }));
  });

  it('denies Maintenance before querying the report', async () => {
    const reportService = { essential: vi.fn() };
    const response = await request(appFor('manutencao', reportService)).get('/api/reports/essential');
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('ROLE_FORBIDDEN');
    expect(reportService.essential).not.toHaveBeenCalled();
  });
});
