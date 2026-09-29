import { describe, expect, it, vi } from 'vitest';
import { createContractService } from '../src/modules/contracts/contracts.service.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const CONTRACT_ID = '7f2d9100-46d0-42cd-b854-445af2ddde3e';

function setup(overrides = {}) {
  const repository = {
    listActive: vi.fn().mockResolvedValue([]), findActive: vi.fn().mockResolvedValue(null),
    findTenantUnit: vi.fn().mockResolvedValue(null), hasPeriodConflict: vi.fn().mockResolvedValue(false),
    create: vi.fn().mockResolvedValue(null), ...overrides,
  };
  const documentGenerator = { generate: vi.fn().mockResolvedValue({ buffer: Buffer.from('docx'), filename: 'contract.docx' }) };
  return { repository, documentGenerator, service: createContractService(repository, documentGenerator) };
}

describe('contract service', () => {
  it('applies the persisted gestor scope and fixed template version', async () => {
    const contract = { id: CONTRACT_ID };
    const { service, repository } = setup({ listActive: vi.fn().mockResolvedValue([]), findActive: vi.fn().mockResolvedValue(contract), findTenantUnit: vi.fn().mockResolvedValue('unit'), create: vi.fn().mockResolvedValue(contract) });
    const auth = { role: 'gestor', buildingId: BUILDING_ID };
    await service.list(auth); await service.get(CONTRACT_ID, auth); await service.create({ tenantId: 'tenant' }, auth);
    expect(repository.listActive).toHaveBeenCalledWith(BUILDING_ID);
    expect(repository.findActive).toHaveBeenCalledWith(CONTRACT_ID, BUILDING_ID);
    expect(repository.create).toHaveBeenCalledWith({ tenantId: 'tenant', templateVersion: 'temporada-v1' }, BUILDING_ID);
  });

  it('rejects a contract whose period overlaps another contract for the unit', async () => {
    const { service, repository } = setup({ findTenantUnit: vi.fn().mockResolvedValue('unit'), hasPeriodConflict: vi.fn().mockResolvedValue(true) });
    await expect(service.create({ tenantId: 'tenant', startDate: '2026-10-01', endDate: '2027-01-01' }, { role: 'gerente' }))
      .rejects.toMatchObject({ status: 409, code: 'CONTRACT_PERIOD_CONFLICT' });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('fails closed for an invalid gestor scope and hidden resources', async () => {
    const { service, repository } = setup();
    await expect(service.list({ role: 'gestor', buildingId: null })).rejects.toMatchObject({ status: 403, code: 'PROFILE_SCOPE_INVALID' });
    await expect(service.get(CONTRACT_ID, { role: 'admin' })).rejects.toMatchObject({ status: 404, code: 'CONTRACT_NOT_FOUND' });
    await expect(service.create({}, { role: 'admin' })).rejects.toMatchObject({ status: 404, code: 'TENANT_NOT_FOUND' });
    expect(repository.listActive).not.toHaveBeenCalled();
  });

  it('generates a document only after retrieving an authorized contract', async () => {
    const contract = { id: CONTRACT_ID };
    const { service, documentGenerator } = setup({ findActive: vi.fn().mockResolvedValue(contract) });
    const result = await service.document(CONTRACT_ID, { role: 'financeiro' });
    expect(documentGenerator.generate).toHaveBeenCalledWith(contract);
    expect(result.filename).toBe('contract.docx');
  });
});
