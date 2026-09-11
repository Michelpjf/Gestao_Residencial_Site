import express from 'express';
import { getAuthContext } from './get-auth-context.js';

export function createAuthRouter({ authenticate }) {
  const router = express.Router();

  router.get('/context', authenticate, getAuthContext);

  return router;
}
