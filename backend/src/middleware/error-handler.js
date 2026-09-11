import { AppError } from '../errors/app-error.js';

export function errorHandler(error, _req, res, _next) {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body contains invalid JSON',
      },
    });
  }

  console.error('Unhandled request error');
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
