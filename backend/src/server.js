import 'dotenv/config';
import { createApp } from './app.js';
import { loadConfig } from './config/env.js';
import { createDatabasePool } from './db/pool.js';
import { createAuthenticate } from './middleware/authenticate.js';
import { createUserProfileRepository } from './repositories/user-profile-repository.js';
import { createSupabaseTokenVerifier } from './security/supabase-token-verifier.js';

const config = loadConfig();
const pool = createDatabasePool(config.database);
const userProfileRepository = createUserProfileRepository(pool);
const verifyToken = createSupabaseTokenVerifier({
  supabaseUrl: config.supabase.url,
  publishableKey: config.supabase.publishableKey,
  audience: config.supabase.audience,
});

const authenticate = createAuthenticate({ verifyToken, userProfileRepository });

const app = createApp({ trustProxy: config.trustProxy, authenticate });
const server = app.listen(config.port, () => {
  console.info(`Backend listening on port ${config.port}`);
});

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(`Received ${signal}; shutting down`);

  server.close(async () => {
    await pool.end();
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
