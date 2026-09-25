import { describe, expect, it, vi } from 'vitest';
import { createReportService } from '../src/modules/reports/reports.service.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';

describe('essential report service', () => {
  it.each(['admin', 'gerente', 'financeiro'])('uses global scope for %s', async (role) => {
    const repository = { essential: vi.fn().mockResolvedValue({ summary: {}, rows: [] }) };
    await createReportService(repository).essential({ role, buildingId: BUILDING_ID });
    expect(repository.essential).toHaveBeenCalledWith(null);
  });

  it('limits Gestor to the persisted profile scope', async () => {
    const repository = { essential: vi.fn().mockResolvedValue({ summary: {}, rows: [] }) };
    await createReportService(repository).essential({ role: 'gestor', buildingId: BUILDING_ID });
    expect(repository.essential).toHaveBeenCalledWith(BUILDING_ID);
  });

  it('fails closed when Gestor has an invalid scope', async () => {
    const repository = { essential: vi.fn() };
    await expect(createReportService(repository).essential({ role: 'gestor', buildingId: null }))
      .rejects.toMatchObject({ status: 403, code: 'PROFILE_SCOPE_INVALID' });
    expect(repository.essential).not.toHaveBeenCalled();
  });
});
