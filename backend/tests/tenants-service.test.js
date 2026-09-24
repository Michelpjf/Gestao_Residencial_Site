import { describe, expect, it, vi } from 'vitest';
import { createTenantService } from '../src/modules/tenants/tenants.service.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const TENANT_ID = '7f2d9100-46d0-42cd-b854-445af2ddde3e';

function setup(overrides = {}) {
  const repository = { listActive: vi.fn().mockResolvedValue([]), findActive: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue(null), ...overrides };
  return { repository, service: createTenantService(repository) };
}

describe('tenant service', () => {
  it('applies the persisted gestor building scope to every operation', async () => {
    const tenant = { id: TENANT_ID };
    const { service, repository } = setup({ listActive: vi.fn().mockResolvedValue([]), findActive: vi.fn().mockResolvedValue(tenant), create: vi.fn().mockResolvedValue(tenant) });
    const auth = { role: 'gestor', buildingId: BUILDING_ID };
    await service.list(auth); await service.get(TENANT_ID, auth); await service.create({}, auth);
    expect(repository.listActive).toHaveBeenCalledWith(BUILDING_ID);
    expect(repository.findActive).toHaveBeenCalledWith(TENANT_ID, BUILDING_ID);
    expect(repository.create).toHaveBeenCalledWith({}, BUILDING_ID);
  });

  it('fails closed when gestor has no valid building scope', async () => {
    const { service, repository } = setup();
    await expect(service.list({ role: 'gestor', buildingId: null })).rejects.toMatchObject({ status: 403, code: 'PROFILE_SCOPE_INVALID' });
    expect(repository.listActive).not.toHaveBeenCalled();
  });

  it('does not reveal tenants or units outside the authorized scope', async () => {
    const { service } = setup();
    await expect(service.get(TENANT_ID, { role: 'gestor', buildingId: BUILDING_ID })).rejects.toMatchObject({ status: 404, code: 'TENANT_NOT_FOUND' });
    await expect(service.create({}, { role: 'gestor', buildingId: BUILDING_ID })).rejects.toMatchObject({ status: 404, code: 'UNIT_NOT_FOUND' });
  });

  it('maps the normalized CPF uniqueness constraint to a stable conflict', async () => {
    const duplicate = Object.assign(new Error('duplicate'), { code: '23505', constraint: 'tenants_cpf_unique_idx' });
    const { service } = setup({ create: vi.fn().mockRejectedValue(duplicate) });
    await expect(service.create({}, { role: 'admin' })).rejects.toMatchObject({ status: 409, code: 'TENANT_CPF_CONFLICT' });
  });
});
