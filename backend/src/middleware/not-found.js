import { AppError } from '../errors/app-error.js';

export function notFound(_req, _res, next) {
  return next(new AppError(404, 'ROUTE_NOT_FOUND', 'Route not found'));
}
