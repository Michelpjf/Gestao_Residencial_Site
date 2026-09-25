import express from 'express';
import { createAuthRouter } from './auth/auth.routes.js';
import { createBuildingsRouter } from './buildings/buildings.routes.js';
import { createUnitsRouter } from './units/units.routes.js';
import { createTenantsRouter } from './tenants/tenants.routes.js';
import { createContractsRouter } from './contracts/contracts.routes.js';
import { createReportsRouter } from './reports/reports.routes.js';

export function createApiRouter({ authenticate, buildingService, unitService, tenantService, contractService, reportService } = {}) {
  const router = express.Router();

  if (authenticate) {
    router.use('/auth', createAuthRouter({ authenticate }));
  }

  if (authenticate && buildingService) {
    router.use('/buildings', createBuildingsRouter({ authenticate, buildingService }));
  }

  if (authenticate && unitService) {
    router.use('/', createUnitsRouter({ authenticate, unitService }));
  }

  if (authenticate && tenantService) {
    router.use('/tenants', createTenantsRouter({ authenticate, tenantService }));
  }

  if (authenticate && contractService) {
    router.use('/contracts', createContractsRouter({ authenticate, contractService }));
  }

  if (authenticate && reportService) {
    router.use('/reports', createReportsRouter({ authenticate, reportService }));
  }

  return router;
}
