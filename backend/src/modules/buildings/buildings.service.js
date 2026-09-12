import { AppError } from '../../errors/app-error.js';

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

export function createBuildingService(repository) {
  return Object.freeze({
    list(auth) {
      const buildingId = auth.role === 'gestor' ? auth.buildingId : null;
      return repository.listActive({ buildingId });
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
