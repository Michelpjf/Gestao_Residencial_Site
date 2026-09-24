import { createDatabasePool } from '../db/pool.js';
import { createAuthenticate } from '../middleware/authenticate.js';
import { createBuildingRepository } from '../modules/buildings/buildings.repository.js';
import { createBuildingService } from '../modules/buildings/buildings.service.js';
import { createUnitRepository } from '../modules/units/units.repository.js';
import { createUnitService } from '../modules/units/units.service.js';
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

  return Object.freeze({
    appDependencies: Object.freeze({ authenticate, buildingService, unitService }),
    async close() {
      await pool.end();
    },
  });
}
