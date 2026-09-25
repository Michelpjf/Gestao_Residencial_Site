import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

function scopeFrom(auth) {
  if (auth.role !== 'gestor') return null;
  if (!z.uuid().safeParse(auth.buildingId).success) {
    throw new AppError(403, 'PROFILE_SCOPE_INVALID', 'Manager profile has no valid building scope');
  }
  return auth.buildingId;
}

export function createReportService(repository) {
  return Object.freeze({
    async essential(auth) {
      return repository.essential(scopeFrom(auth));
    },
  });
}
