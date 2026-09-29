import { describe, expect, it, vi } from 'vitest';
import { createReportRepository } from '../src/modules/reports/reports.repository.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';

describe('essential report repository', () => {
  it('maps distinct persisted totals and rows without personal fields', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [{
      active_buildings: '2', units: '7', vacant_units: '3', occupied_units: '2',
      scheduled_contracts: '2', active_contracts: '2', active_tenants: '4', archived_tenants: '1',
      building_id: BUILDING_ID, building_name: 'Residencial Fictício',
      unit_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', unit_identification: '101',
      unit_subdivision: null, tenant_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      tenant_name: 'Morador Fictício', contract_number: '7',
    }] });

    const result = await createReportRepository({ query }).essential(null);

    expect(result.summary).toEqual({
      activeBuildings: 2, units: 7, vacantUnits: 3, occupiedUnits: 2,
      scheduledContracts: 2, activeContracts: 2, activeTenants: 4, archivedTenants: 1,
    });
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
    expect(statement).toContain('c.start_date > CURRENT_DATE');
    expect(statement).toContain('CURRENT_DATE BETWEEN c.start_date AND c.end_date');
    expect(statement).not.toMatch(/cpf|rg|phone|address|rent_amount/i);
    expect(parameters).toEqual([null]);
  });

  it('passes gestor scope into every report relation and supports an empty result', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [{
      active_buildings: '0', units: '0', vacant_units: '0', occupied_units: '0',
      scheduled_contracts: '0', active_contracts: '0', active_tenants: '0', archived_tenants: '0',
      building_id: null, building_name: null, unit_id: null, unit_identification: null,
      unit_subdivision: null, tenant_id: null, tenant_name: null, contract_number: null,
    }] });

    const result = await createReportRepository({ query }).essential(BUILDING_ID);
    expect(result).toEqual({
      summary: {
        activeBuildings: 0, units: 0, vacantUnits: 0, occupiedUnits: 0,
        scheduledContracts: 0, activeContracts: 0, activeTenants: 0, archivedTenants: 0,
      },
      rows: [],
    });
    expect(query).toHaveBeenCalledWith(expect.stringContaining('id = $1'), [BUILDING_ID]);
  });
});
