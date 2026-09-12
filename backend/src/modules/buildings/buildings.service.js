import { AppError } from '../../errors/app-error.js';
import { z } from 'zod';

const internalBuildingIdSchema = z.uuid();

function conflictFrom(error) {
  if (error?.code === '23505') {
    throw new AppError(409, 'BUILDING_NAME_CONFLICT', 'Building name is already in use', {
      cause: error,
    });
  }
  throw error;
}

function requireBuilding(building) {
  if (!building) {
    throw new AppError(404, 'BUILDING_NOT_FOUND', 'Active building was not found');
  }
  return building;
}

function scopeFrom(auth) {
  if (auth.role !== 'gestor') return null;
  if (!internalBuildingIdSchema.safeParse(auth.buildingId).success) {
    throw new AppError(403, 'PROFILE_SCOPE_INVALID', 'Manager profile has no valid building scope');
  }
  return auth.buildingId;
}

export function createBuildingService(repository) {
  return Object.freeze({
    list(auth) {
      return repository.listActive({ buildingId: scopeFrom(auth) });
    },

    async create(input) {
      try {
        return await repository.create(input);
      } catch (error) {
        return conflictFrom(error);
      }
    },

    async update(id, input) {
      try {
        return requireBuilding(await repository.updateName({ id, name: input.name }));
      } catch (error) {
        return conflictFrom(error);
      }
    },

    async deactivate(id) {
      return requireBuilding(await repository.deactivate(id));
    },
  });
}
