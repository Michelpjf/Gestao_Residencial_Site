import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

function scopeFrom(auth) {
  if (auth.role !== 'gestor') return null;
  if (!z.uuid().safeParse(auth.buildingId).success) {
    throw new AppError(403, 'PROFILE_SCOPE_INVALID', 'Manager profile has no valid building scope');
  }
  return auth.buildingId;
}

export function createTenantService(repository) {
  return Object.freeze({
    async list(auth) {
      return repository.listActive(scopeFrom(auth));
    },

    async get(tenantId, auth) {
      const tenant = await repository.findActive(tenantId, scopeFrom(auth));
      if (!tenant) throw new AppError(404, 'TENANT_NOT_FOUND', 'Tenant was not found');
      return tenant;
    },

    async create(input, auth) {
      try {
        const tenant = await repository.create(input, scopeFrom(auth));
        if (!tenant) throw new AppError(404, 'UNIT_NOT_FOUND', 'Active unit was not found');
        return tenant;
      } catch (error) {
        if (error?.code === '23505' && error.constraint === 'tenants_cpf_unique_idx') {
          throw new AppError(409, 'TENANT_CPF_CONFLICT', 'CPF is already in use');
        }
        throw error;
      }
    },
  });
}
