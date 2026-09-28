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

export function enforceReadOnlyRoles(...readOnlyRoles) {
  if (readOnlyRoles.length === 0 || readOnlyRoles.some((role) => !isBusinessRole(role))) {
    throw new TypeError('enforceReadOnlyRoles must receive at least one valid business role');
  }

  const readOnly = new Set(readOnlyRoles);
  const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);

  return function enforceReadOnly(req, _res, next) {
    if (!req.auth) {
      return next(new AppError(401, 'AUTH_REQUIRED', 'Authentication is required'));
    }

    if (readOnly.has(req.auth.role) && !safeMethods.has(req.method)) {
      return next(new AppError(403, 'ROLE_READ_ONLY', 'Role is read-only'));
    }

    return next();
  };
}
