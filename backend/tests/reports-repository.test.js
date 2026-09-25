import { describe, expect, it, vi } from 'vitest';
import { createReportRepository } from '../src/modules/reports/reports.repository.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';

describe('essential report repository', () => {
  it('maps distinct persisted totals and rows without personal fields', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [{
      active_buildings: '2', units: '3', tenants: '2', contracts: '4',
      building_id: BUILDING_ID, building_name: 'Residencial Fictício',
      unit_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', unit_identification: '101',
      unit_subdivision: null, tenant_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      tenant_name: 'Morador Fictício', contract_number: '7',
    }] });

    const result = await createReportRepository({ query }).essential(null);

    expect(result.summary).toEqual({ activeBuildings: 2, units: 3, tenants: 2, contracts: 4 });
    expect(result.rows[0]).toEqual({
      buildingId: BUILDING_ID,
      buildingName: 'Residencial Fictício',
      unitId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      unitIdentification: '101',
      unitSubdivision: null,
      tenantId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      tenantName: 'Morador Fictício',
      contractNumber: 7,
    });
    expect(result.rows[0]).not.toHaveProperty('cpf');
    expect(result.rows[0]).not.toHaveProperty('phone');
    const [statement, parameters] = query.mock.calls[0];
    expect(statement).toContain('COUNT(DISTINCT c.id)');
    expect(statement).not.toMatch(/cpf|rg|phone|address|rent_amount|start_date|end_date/i);
    expect(parameters).toEqual([null]);
  });

  it('passes gestor scope into every report relation and supports an empty result', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [{
      active_buildings: '0', units: '0', tenants: '0', contracts: '0',
      building_id: null, building_name: null, unit_id: null, unit_identification: null,
      unit_subdivision: null, tenant_id: null, tenant_name: null, contract_number: null,
    }] });

    const result = await createReportRepository({ query }).essential(BUILDING_ID);
    expect(result).toEqual({
      summary: { activeBuildings: 0, units: 0, tenants: 0, contracts: 0 },
      rows: [],
    });
    expect(query).toHaveBeenCalledWith(expect.stringContaining('id = $1'), [BUILDING_ID]);
  });
});
