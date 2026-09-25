import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

const templateVersion = 'temporada-v1';

function scopeFrom(auth) {
  if (auth.role !== 'gestor') return null;
  if (!z.uuid().safeParse(auth.buildingId).success) {
    throw new AppError(403, 'PROFILE_SCOPE_INVALID', 'Manager profile has no valid building scope');
  }
  return auth.buildingId;
}

export function createContractService(repository, documentGenerator) {
  async function getPersisted(contractId, auth) {
    const contract = await repository.findActive(contractId, scopeFrom(auth));
    if (!contract) throw new AppError(404, 'CONTRACT_NOT_FOUND', 'Contract was not found');
    return contract;
  }

  function toPublic(contract) {
    return Object.freeze({
      id: contract.id,
      contractNumber: contract.contractNumber,
      tenantId: contract.tenantId,
      tenantName: contract.tenantName,
      unitId: contract.unitId,
      buildingId: contract.buildingId,
      buildingName: contract.buildingName,
      unitIdentification: contract.unitIdentification,
      unitSubdivision: contract.unitSubdivision,
      unitType: contract.unitType,
      rentAmount: contract.rentAmount,
      termMonths: contract.termMonths,
      startDate: contract.startDate,
      endDate: contract.endDate,
      templateVersion: contract.templateVersion,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    });
  }

  return Object.freeze({
    async list(auth) {
      return repository.listActive(scopeFrom(auth));
    },
    async get(contractId, auth) {
      return toPublic(await getPersisted(contractId, auth));
    },
    async create(input, auth) {
      const contract = await repository.create({ ...input, templateVersion }, scopeFrom(auth));
      if (!contract) throw new AppError(404, 'TENANT_NOT_FOUND', 'Tenant was not found');
      return toPublic(contract);
    },
    async document(contractId, auth) {
      return documentGenerator.generate(await getPersisted(contractId, auth));
    },
  });
}
