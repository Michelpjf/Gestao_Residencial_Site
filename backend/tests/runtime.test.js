import { describe, expect, it, vi } from 'vitest';
import { createRuntime } from '../src/composition/create-runtime.js';

describe('runtime composition', () => {
  it('isolates provider-specific wiring from the HTTP application', async () => {
    const pool = { end: vi.fn() };
    const repository = { findActiveByIdentity: vi.fn() };
    const buildingRepository = { listActive: vi.fn() };
    const buildingService = { list: vi.fn() };
    const verifyToken = vi.fn();
    const authenticate = vi.fn();
    const createPool = vi.fn().mockReturnValue(pool);
    const createTokenVerifier = vi.fn().mockReturnValue(verifyToken);
    const createProfileRepository = vi.fn().mockReturnValue(repository);
    const createAuthenticationMiddleware = vi.fn().mockReturnValue(authenticate);
    const createBuildingsRepository = vi.fn().mockReturnValue(buildingRepository);
    const createBuildingsService = vi.fn().mockReturnValue(buildingService);
    const config = {
      database: { connectionString: 'postgres://database' },
      supabase: {
        url: 'https://project.supabase.co',
        publishableKey: 'public-key',
        audience: 'authenticated',
      },
    };

    const runtime = createRuntime(config, {
      createPool,
      createTokenVerifier,
      createProfileRepository,
      createAuthenticationMiddleware,
      createBuildingsRepository,
      createBuildingsService,
    });

    expect(createPool).toHaveBeenCalledWith(config.database);
    expect(createTokenVerifier).toHaveBeenCalledWith({
      supabaseUrl: config.supabase.url,
      publishableKey: config.supabase.publishableKey,
      audience: config.supabase.audience,
    });
    expect(createProfileRepository).toHaveBeenCalledWith(pool);
    expect(createAuthenticationMiddleware).toHaveBeenCalledWith({
      identityProvider: 'supabase',
      verifyToken,
      userProfileRepository: repository,
    });
    expect(createBuildingsRepository).toHaveBeenCalledWith(pool);
    expect(createBuildingsService).toHaveBeenCalledWith(buildingRepository);
    expect(runtime.appDependencies).toEqual({ authenticate, buildingService });

    await runtime.close();
    expect(pool.end).toHaveBeenCalledOnce();
  });
});
