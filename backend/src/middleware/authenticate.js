import { z } from 'zod';
import { isBusinessRole } from '../config/roles.js';
import { AppError } from '../errors/app-error.js';

const userIdSchema = z.uuid();

function readBearerToken(header) {
  if (!header) {
    throw new AppError(401, 'AUTH_TOKEN_MISSING', 'Bearer token is required');
  }

  const match = /^Bearer ([^\s]+)$/i.exec(header);
  if (!match) {
    throw new AppError(401, 'AUTH_TOKEN_MALFORMED', 'Authorization header must use Bearer');
  }

  return match[1];
}

export function createAuthenticate({ identityProvider, verifyToken, userProfileRepository }) {
  return async function authenticate(req, _res, next) {
    let claims;

    try {
      const token = readBearerToken(req.get('authorization'));
      claims = await verifyToken(token);
    } catch (error) {
      if (error instanceof AppError) return next(error);
      return next(new AppError(401, 'AUTH_TOKEN_INVALID', 'Bearer token is invalid'));
    }

    const parsedUserId = userIdSchema.safeParse(claims.sub);
    if (!parsedUserId.success) {
      return next(new AppError(401, 'AUTH_TOKEN_INVALID', 'Bearer token is invalid'));
    }

    const profile = await userProfileRepository.findActiveByIdentity({
      provider: identityProvider,
      subject: parsedUserId.data,
    });
    if (!profile || !isBusinessRole(profile.role)) {
      return next(new AppError(403, 'PROFILE_NOT_AUTHORIZED', 'User profile is not authorized'));
    }

    if (profile.role === 'gestor' && !z.uuid().safeParse(profile.buildingId).success) {
      return next(new AppError(403, 'PROFILE_SCOPE_INVALID', 'Manager profile has no valid building scope'));
    }

    req.auth = Object.freeze({
      userId: profile.userId,
      role: profile.role,
      buildingId: profile.buildingId ?? null,
    });

    return next();
  };
}
