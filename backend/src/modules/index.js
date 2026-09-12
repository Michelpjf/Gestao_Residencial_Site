import express from 'express';
import { createAuthRouter } from './auth/auth.routes.js';
import { createBuildingsRouter } from './buildings/buildings.routes.js';

export function createApiRouter({ authenticate, buildingService } = {}) {
  const router = express.Router();

  if (authenticate) {
    router.use('/auth', createAuthRouter({ authenticate }));
  }

  if (authenticate && buildingService) {
    router.use('/buildings', createBuildingsRouter({ authenticate, buildingService }));
  }

  return router;
}
