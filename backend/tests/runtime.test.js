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
    const unitRepository = { listActive: vi.fn() };
    const unitService = { list: vi.fn(), get: vi.fn(), create: vi.fn() };
    const createUnitsRepository = vi.fn().mockReturnValue(unitRepository);
    const createUnitsService = vi.fn().mockReturnValue(unitService);
    const tenantRepository = { listActive: vi.fn() };
    const tenantService = { list: vi.fn(), get: vi.fn(), create: vi.fn() };
    const createTenantsRepository = vi.fn().mockReturnValue(tenantRepository);
    const createTenantsService = vi.fn().mockReturnValue(tenantService);
    const contractRepository = { listActive: vi.fn() };
    const contractService = { list: vi.fn(), get: vi.fn(), create: vi.fn(), document: vi.fn() };
    const contractDocumentGenerator = { generate: vi.fn() };
    const createContractsRepository = vi.fn().mockReturnValue(contractRepository);
    const createContractsService = vi.fn().mockReturnValue(contractService);
    const createContractsDocumentGenerator = vi.fn().mockReturnValue(contractDocumentGenerator);
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
      createUnitsRepository,
      createUnitsService,
      createTenantsRepository,
      createTenantsService,
      createContractsRepository,
      createContractsService,
      createContractsDocumentGenerator,
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
    expect(createUnitsRepository).toHaveBeenCalledWith(pool);
    expect(createUnitsService).toHaveBeenCalledWith(unitRepository, buildingRepository);
    expect(createTenantsRepository).toHaveBeenCalledWith(pool);
    expect(createTenantsService).toHaveBeenCalledWith(tenantRepository);
    expect(createContractsRepository).toHaveBeenCalledWith(pool);
    expect(createContractsDocumentGenerator).toHaveBeenCalledOnce();
    expect(createContractsService).toHaveBeenCalledWith(contractRepository, contractDocumentGenerator);
    expect(runtime.appDependencies).toEqual({ authenticate, buildingService, unitService, tenantService, contractService });

    await runtime.close();
    expect(pool.end).toHaveBeenCalledOnce();
  });
});
