import { describe, expect, it, vi } from 'vitest';
import { createBuildingService } from '../src/modules/buildings/buildings.service.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';

describe('building service', () => {
  it('limits gestor listing to the persisted building scope', async () => {
    const repository = { listActive: vi.fn().mockResolvedValue([]) };
    const service = createBuildingService(repository);

    await service.list({ role: 'gestor', buildingId: BUILDING_ID });
    expect(repository.listActive).toHaveBeenCalledWith({ buildingId: BUILDING_ID });
  });

  it('does not scope a global role from client-controlled values', async () => {
    const repository = { listActive: vi.fn().mockResolvedValue([]) };
    const service = createBuildingService(repository);

    await service.list({ role: 'admin', buildingId: BUILDING_ID });
    expect(repository.listActive).toHaveBeenCalledWith({ buildingId: null });
  });

  it('maps a duplicate name to a stable conflict error', async () => {
    const duplicate = Object.assign(new Error('database detail'), { code: '23505' });
    const service = createBuildingService({ create: vi.fn().mockRejectedValue(duplicate) });

    await expect(service.create({ name: 'Residencial Bueno' })).rejects.toMatchObject({
      status: 409,
      code: 'BUILDING_NAME_CONFLICT',
    });
  });

  it('returns not found when updating an inactive or absent building', async () => {
    const service = createBuildingService({ updateName: vi.fn().mockResolvedValue(null) });

    await expect(service.update(BUILDING_ID, { name: 'Novo nome' })).rejects.toMatchObject({
      status: 404,
      code: 'BUILDING_NOT_FOUND',
    });
  });
});
