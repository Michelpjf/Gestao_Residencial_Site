import { createDatabasePool } from '../db/pool.js';
import { createAuthenticate } from '../middleware/authenticate.js';
import { createUserProfileRepository } from '../repositories/user-profile-repository.js';
import { createSupabaseTokenVerifier } from '../security/supabase-token-verifier.js';

export function createRuntime(
  config,
  {
    createPool = createDatabasePool,
    createTokenVerifier = createSupabaseTokenVerifier,
    createProfileRepository = createUserProfileRepository,
    createAuthenticationMiddleware = createAuthenticate,
  } = {},
) {
  const pool = createPool(config.database);
  const userProfileRepository = createProfileRepository(pool);
  const verifyToken = createTokenVerifier({
    supabaseUrl: config.supabase.url,
    publishableKey: config.supabase.publishableKey,
    audience: config.supabase.audience,
  });
  const authenticate = createAuthenticationMiddleware({ verifyToken, userProfileRepository });

  return Object.freeze({
    appDependencies: Object.freeze({ authenticate }),
    async close() {
      await pool.end();
    },
  });
}
