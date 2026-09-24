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
      createdAt: new Date('2026-09-23T00:00:00.000Z'),
      updatedAt: new Date('2026-09-23T00:00:00.000Z'),
    });
    expect(query).toHaveBeenCalledWith(expect.stringContaining('b.active = TRUE'), [BUILDING_ID]);
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
