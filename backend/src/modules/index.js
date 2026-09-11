import express from 'express';
import { createAuthRouter } from './auth/auth.routes.js';

export function createApiRouter({ authenticate } = {}) {
  const router = express.Router();

  if (authenticate) {
    router.use('/auth', createAuthRouter({ authenticate }));
  }

  return router;
}
