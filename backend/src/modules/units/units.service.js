import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

function scopeFrom(auth) {
  if (auth.role !== 'gestor') return null;
  if (!z.uuid().safeParse(auth.buildingId).success) {
    throw new AppError(403, 'PROFILE_SCOPE_INVALID', 'Manager profile has no valid building scope');
  }
  return auth.buildingId;
}

export function createUnitService(repository, buildingRepository) {
  return Object.freeze({
    async list(buildingId, auth) {
      const scope = scopeFrom(auth);
      if (scope && scope.toLowerCase() !== buildingId.toLowerCase()) {
        throw new AppError(403, 'BUILDING_SCOPE_FORBIDDEN', 'Building is outside the user scope');
      }
      const buildings = await buildingRepository.listActive({ buildingId });
      if (buildings.length === 0) {
        throw new AppError(404, 'BUILDING_NOT_FOUND', 'Active building was not found');
      }
      return repository.listActive(buildingId);
    },

    async get(unitId, auth) {
      const unit = await repository.findActive(unitId, scopeFrom(auth));
      if (!unit) throw new AppError(404, 'UNIT_NOT_FOUND', 'Active unit was not found');
      return unit;
    },

    async create(buildingId, input) {
      try {
        const unit = await repository.create({ buildingId, ...input });
        if (!unit) throw new AppError(404, 'BUILDING_NOT_FOUND', 'Active building was not found');
        return unit;
      } catch (error) {
        if (error?.code === '23505' && error.constraint === 'units_building_subdivision_identification_unique_idx') {
          throw new AppError(409, 'UNIT_ALREADY_EXISTS', 'Unit identification is already in use');
        }
        throw error;
      }
    },
  });
}
