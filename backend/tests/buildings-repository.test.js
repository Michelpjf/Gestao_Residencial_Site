import { describe, expect, it, vi } from 'vitest';
import { createBuildingRepository } from '../src/modules/buildings/buildings.repository.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';

function databaseRow(overrides = {}) {
  return {
    id: BUILDING_ID,
    name: 'Residencial Bueno',
    active: true,
    created_at: new Date('2026-09-12T00:00:00.000Z'),
    updated_at: new Date('2026-09-12T00:00:00.000Z'),
    ...overrides,
  };
}

describe('building repository', () => {
  it('uses a parameterized server-side scope when listing', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [databaseRow()] });
    const repository = createBuildingRepository({ query });

    const result = await repository.listActive({ buildingId: BUILDING_ID });

    expect(result[0]).toEqual({
      id: BUILDING_ID,
      name: 'Residencial Bueno',
      active: true,
      createdAt: new Date('2026-09-12T00:00:00.000Z'),
      updatedAt: new Date('2026-09-12T00:00:00.000Z'),
    });
    expect(query).toHaveBeenCalledWith(expect.stringContaining('($1::UUID IS NULL OR id = $1)'), [
      BUILDING_ID,
    ]);
  });

  it('parameterizes name and id when updating', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [databaseRow({ name: 'Novo nome' })] });
    const repository = createBuildingRepository({ query });

    await repository.updateName({ id: BUILDING_ID, name: 'Novo nome' });

    expect(query).toHaveBeenCalledWith(expect.stringContaining('SET name = $2'), [
      BUILDING_ID,
      'Novo nome',
    ]);
  });
});
