import { isBusinessRole } from '../config/roles.js';
import { AppError } from '../errors/app-error.js';

export function requireRoles(...allowedRoles) {
  if (allowedRoles.length === 0 || allowedRoles.some((role) => !isBusinessRole(role))) {
    throw new TypeError('requireRoles must receive at least one valid business role');
  }

  const allowed = new Set(allowedRoles);

  return function authorize(req, _res, next) {
    if (!req.auth) {
      return next(new AppError(401, 'AUTH_REQUIRED', 'Authentication is required'));
    }

    if (!allowed.has(req.auth.role)) {
      return next(new AppError(403, 'ROLE_FORBIDDEN', 'Role is not allowed for this resource'));
    }

    return next();
  };
}
