import { createDatabasePool } from '../db/pool.js';
import { createAuthenticate } from '../middleware/authenticate.js';
import { createBuildingRepository } from '../modules/buildings/buildings.repository.js';
import { createBuildingService } from '../modules/buildings/buildings.service.js';
import { createUnitRepository } from '../modules/units/units.repository.js';
import { createUnitService } from '../modules/units/units.service.js';
import { createTenantRepository } from '../modules/tenants/tenants.repository.js';
import { createTenantService } from '../modules/tenants/tenants.service.js';
import { createContractRepository } from '../modules/contracts/contracts.repository.js';
import { createContractService } from '../modules/contracts/contracts.service.js';
import { createContractDocumentGenerator } from '../modules/contracts/contracts.document.js';
import { createUserProfileRepository } from '../repositories/user-profile-repository.js';
import { createSupabaseTokenVerifier } from '../security/supabase-token-verifier.js';

export function createRuntime(
  config,
  {
    createPool = createDatabasePool,
    createTokenVerifier = createSupabaseTokenVerifier,
    createProfileRepository = createUserProfileRepository,
    createAuthenticationMiddleware = createAuthenticate,
    createBuildingsRepository = createBuildingRepository,
    createBuildingsService = createBuildingService,
    createUnitsRepository = createUnitRepository,
    createUnitsService = createUnitService,
    createTenantsRepository = createTenantRepository,
    createTenantsService = createTenantService,
    createContractsRepository = createContractRepository,
    createContractsService = createContractService,
    createContractsDocumentGenerator = createContractDocumentGenerator,
  } = {},
) {
  const pool = createPool(config.database);
  const userProfileRepository = createProfileRepository(pool);
  const verifyToken = createTokenVerifier({
    supabaseUrl: config.supabase.url,
    publishableKey: config.supabase.publishableKey,
    audience: config.supabase.audience,
  });
  const authenticate = createAuthenticationMiddleware({
    identityProvider: 'supabase',
    verifyToken,
    userProfileRepository,
  });
  const buildingRepository = createBuildingsRepository(pool);
  const buildingService = createBuildingsService(buildingRepository);
  const unitRepository = createUnitsRepository(pool);
  const unitService = createUnitsService(unitRepository, buildingRepository);
  const tenantRepository = createTenantsRepository(pool);
  const tenantService = createTenantsService(tenantRepository);
  const contractRepository = createContractsRepository(pool);
  const contractDocumentGenerator = createContractsDocumentGenerator();
  const contractService = createContractsService(contractRepository, contractDocumentGenerator);

  return Object.freeze({
    appDependencies: Object.freeze({ authenticate, buildingService, unitService, tenantService, contractService }),
    async close() {
      await pool.end();
    },
  });
}
