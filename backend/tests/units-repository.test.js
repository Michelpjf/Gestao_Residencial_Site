import { describe, expect, it, vi } from 'vitest';
import { createUnitRepository } from '../src/modules/units/units.repository.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const UNIT_ID = '901e6a32-506d-4e27-8dff-fab7e1c4fd92';

function row(overrides = {}) {
  return {
    id: UNIT_ID,
    building_id: BUILDING_ID,
    identification: '101',
    subdivision: 'Bloco A',
    type: 'quarto',
    status: 'vago',
    created_at: new Date('2026-09-23T00:00:00.000Z'),
    updated_at: new Date('2026-09-23T00:00:00.000Z'),
    ...overrides,
  };
}

describe('unit repository', () => {
  it('lists only units from an active building with a parameterized id', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row()] });
    const repository = createUnitRepository({ query });

    const result = await repository.listActive(BUILDING_ID);

    expect(result[0]).toEqual({
      id: UNIT_ID,
      buildingId: BUILDING_ID,
      identification: '101',
      subdivision: 'Bloco A',
      type: 'quarto',
      status: 'vago',
      currentTenantId: null,
      currentTenantName: null,
      currentContractId: null,
      currentContractNumber: null,
      currentContractStartDate: null,
      currentContractEndDate: null,
      scheduledTenantId: null,
      scheduledTenantName: null,
      scheduledContractId: null,
      scheduledContractNumber: null,
      scheduledContractStartDate: null,
      scheduledContractEndDate: null,
      createdAt: new Date('2026-09-23T00:00:00.000Z'),
      updatedAt: new Date('2026-09-23T00:00:00.000Z'),
    });
    expect(query).toHaveBeenCalledWith(expect.stringContaining('b.active = TRUE'), [BUILDING_ID]);
    expect(query.mock.calls[0][0]).toContain('CURRENT_DATE BETWEEN c.start_date AND c.end_date');
    expect(query.mock.calls[0][0]).toContain('c.start_date > CURRENT_DATE');
  });

  it('creates a batch in one transaction and commits only after every insert succeeds', async () => {
    const client = {
      query: vi.fn()
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: BUILDING_ID }] })
        .mockResolvedValueOnce({ rows: [row(), row({ id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', identification: '102' })] })
        .mockResolvedValueOnce({ rows: [] }),
      release: vi.fn(),
    };
    const repository = createUnitRepository({ connect: vi.fn().mockResolvedValue(client) });
    const units = [
      { identification: '101', subdivision: 'Bloco A', type: 'quarto' },
      { identification: '102', subdivision: 'Bloco A', type: 'quarto' },
    ];

    await expect(repository.createBatch(BUILDING_ID, units)).resolves.toHaveLength(2);

    expect(client.query.mock.calls.map(([statement]) => statement)).toEqual([
      'BEGIN',
      'SELECT id FROM buildings WHERE id = $1 AND active = TRUE FOR SHARE',
      expect.stringContaining('jsonb_to_recordset'),
      'COMMIT',
    ]);
    expect(client.query.mock.calls[2][1]).toEqual([BUILDING_ID, JSON.stringify(units)]);
    expect(client.release).toHaveBeenCalledOnce();
  });

  it('rolls back the complete batch when the insert fails', async () => {
    const duplicate = Object.assign(new Error('duplicate'), {
      code: '23505', constraint: 'units_building_subdivision_identification_unique_idx',
    });
    const client = {
      query: vi.fn()
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: BUILDING_ID }] })
        .mockRejectedValueOnce(duplicate)
        .mockResolvedValueOnce({ rows: [] }),
      release: vi.fn(),
    };
    const repository = createUnitRepository({ connect: vi.fn().mockResolvedValue(client) });

    await expect(repository.createBatch(BUILDING_ID, [
      { identification: '101', subdivision: null, type: 'quarto' },
    ])).rejects.toBe(duplicate);
    expect(client.query).toHaveBeenLastCalledWith('ROLLBACK');
    expect(client.query).not.toHaveBeenCalledWith('COMMIT');
    expect(client.release).toHaveBeenCalledOnce();
  });

  it('scopes detail lookup in SQL when a gestor building is supplied', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row()] });
    const repository = createUnitRepository({ query });

    await repository.findActive(UNIT_ID, BUILDING_ID);

    expect(query).toHaveBeenCalledWith(expect.stringContaining('u.building_id = $2'), [
      UNIT_ID,
      BUILDING_ID,
    ]);
  });

  it('maps the next scheduled contract while keeping current occupancy as the SQL priority', async () => {
    const scheduled = row({
      status: 'agendado',
      scheduled_tenant_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      scheduled_tenant_name: 'Morador Agendado',
      scheduled_contract_id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      scheduled_contract_number: '12',
      scheduled_contract_start_date: '2026-10-10',
      scheduled_contract_end_date: '2027-01-10',
    });
    const query = vi.fn().mockResolvedValue({ rows: [scheduled] });
    const [unit] = await createUnitRepository({ query }).listActive(BUILDING_ID);
    expect(unit).toMatchObject({
      status: 'agendado', scheduledTenantName: 'Morador Agendado', scheduledContractNumber: 12,
      scheduledContractStartDate: '2026-10-10', scheduledContractEndDate: '2027-01-10',
    });
    const statement = query.mock.calls[0][0];
    expect(statement).toContain("WHEN occupancy.contract_id IS NOT NULL THEN 'ocupado'");
    expect(statement).toContain("WHEN scheduled.contract_id IS NOT NULL THEN 'agendado'");
  });

  it('creates only inside an active building and keeps values parameterized', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row()] });
    const repository = createUnitRepository({ query });

    await repository.create({
      buildingId: BUILDING_ID,
      identification: '101',
      subdivision: 'Bloco A',
      type: 'quarto',
    });

    const [statement, parameters] = query.mock.calls[0];
    expect(statement).toContain('b.active = TRUE');
    expect(statement).toContain('FOR SHARE');
    expect(parameters).toEqual([BUILDING_ID, '101', 'Bloco A', 'quarto']);
  });
});
