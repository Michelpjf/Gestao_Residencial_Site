import { z } from 'zod';
import { AppError } from '../errors/app-error.js';

const buildingIdSchema = z.uuid();

export function requireBuildingAccess(paramName = 'buildingId') {
  return function authorizeBuilding(req, _res, next) {
    if (!req.auth) {
      return next(new AppError(401, 'AUTH_REQUIRED', 'Authentication is required'));
    }

    const parsedBuildingId = buildingIdSchema.safeParse(req.params[paramName]);
    if (!parsedBuildingId.success) {
      return next(new AppError(400, 'BUILDING_ID_INVALID', 'Building id must be a valid UUID'));
    }

    if (
      req.auth.role === 'gestor' &&
      parsedBuildingId.data.toLowerCase() !== req.auth.buildingId?.toLowerCase()
    ) {
      return next(new AppError(403, 'BUILDING_SCOPE_FORBIDDEN', 'Building is outside the user scope'));
    }

    return next();
  };
}
