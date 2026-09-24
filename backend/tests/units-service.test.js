import { describe, expect, it, vi } from 'vitest';
import { createUnitService } from '../src/modules/units/units.service.js';

const BUILDING_A = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const BUILDING_B = '7f2d9100-46d0-42cd-b854-445af2ddde3e';
const UNIT_ID = '901e6a32-506d-4e27-8dff-fab7e1c4fd92';

function createService({ units = {}, buildings = {} } = {}) {
  const repository = {
    listActive: vi.fn().mockResolvedValue([]),
    findActive: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(null),
    ...units,
  };
  const buildingRepository = {
    listActive: vi.fn().mockResolvedValue([{ id: BUILDING_A }]),
    ...buildings,
  };
  return { service: createUnitService(repository, buildingRepository), repository, buildingRepository };
}

describe('unit service', () => {
  it('limits gestor listing to the persisted building scope', async () => {
    const { service, repository } = createService();

    await expect(
      service.list(BUILDING_B, { role: 'gestor', buildingId: BUILDING_A }),
    ).rejects.toMatchObject({ status: 403, code: 'BUILDING_SCOPE_FORBIDDEN' });
    expect(repository.listActive).not.toHaveBeenCalled();
  });

  it('fails closed when gestor has no valid persisted scope', async () => {
    const { service, repository } = createService();

    await expect(service.get(UNIT_ID, { role: 'gestor', buildingId: null })).rejects.toMatchObject({
      status: 403,
      code: 'PROFILE_SCOPE_INVALID',
    });
    expect(repository.findActive).not.toHaveBeenCalled();
  });

  it('rejects creation when the building is inactive or absent', async () => {
    const { service } = createService();

    await expect(
      service.create(BUILDING_A, { identification: '101', subdivision: null, type: 'quarto' }),
    ).rejects.toMatchObject({ status: 404, code: 'BUILDING_NOT_FOUND' });
  });

  it('maps normalized duplicate violations to a stable conflict', async () => {
    const duplicate = Object.assign(new Error('duplicate'), {
      code: '23505',
      constraint: 'units_building_subdivision_identification_unique_idx',
    });
    const { service } = createService({ units: { create: vi.fn().mockRejectedValue(duplicate) } });

    await expect(
      service.create(BUILDING_A, { identification: ' 101 ', subdivision: 'A', type: 'quarto' }),
    ).rejects.toMatchObject({ status: 409, code: 'UNIT_ALREADY_EXISTS' });
  });
});
