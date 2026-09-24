import { describe, expect, it, vi } from 'vitest';
import { createTenantRepository } from '../src/modules/tenants/tenants.repository.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const UNIT_ID = '901e6a32-506d-4e27-8dff-fab7e1c4fd92';
const TENANT_ID = '7f2d9100-46d0-42cd-b854-445af2ddde3e';

function row() {
  return {
    id: TENANT_ID, unit_id: UNIT_ID, building_id: BUILDING_ID, building_name: 'Residencial Bueno',
    unit_identification: '101', unit_subdivision: 'Bloco A', full_name: 'Pessoa Fictícia', cpf: '52998224725',
    rg: '123456 SSP/GO', birth_date: '1990-05-10', marital_status: 'Solteiro',
    address_goiania: 'Rua Fictícia, 10', address_origin: 'Rua de Origem, 20', phone: '(62) 99999-0000',
    reference_one_name: 'Referência Um', reference_one_phone: '(62) 99999-0001',
    reference_two_name: 'Referência Dois', reference_two_phone: '(62) 99999-0002',
    occupation_institution: null, commercial_phone: null, commercial_address: null,
    created_at: new Date('2026-09-23T00:00:00Z'), updated_at: new Date('2026-09-23T00:00:00Z'),
  };
}

const input = {
  unitId: UNIT_ID, fullName: 'Pessoa Fictícia', cpf: '52998224725', rg: '123456 SSP/GO', birthDate: '1990-05-10',
  maritalStatus: 'Solteiro', addressGoiania: 'Rua Fictícia, 10', addressOrigin: 'Rua de Origem, 20', phone: '(62) 99999-0000',
  referenceOneName: 'Referência Um', referenceOnePhone: '(62) 99999-0001', referenceTwoName: 'Referência Dois',
  referenceTwoPhone: '(62) 99999-0002', occupationInstitution: null, commercialPhone: null, commercialAddress: null,
};

describe('tenant repository', () => {
  it('lists active-building tenants with the gestor scope parameterized', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row()] });
    const result = await createTenantRepository({ query }).listActive(BUILDING_ID);

    expect(result[0]).toMatchObject({ id: TENANT_ID, unitId: UNIT_ID, buildingId: BUILDING_ID, fullName: 'Pessoa Fictícia' });
    expect(result[0]).not.toHaveProperty('cpf');
    expect(query).toHaveBeenCalledWith(expect.stringContaining('b.active = TRUE'), [BUILDING_ID]);
    expect(query.mock.calls[0][0]).toContain('u.building_id = $1');
  });

  it('scopes detail lookup through the unit building', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row()] });
    await createTenantRepository({ query }).findActive(TENANT_ID, BUILDING_ID);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('u.building_id = $2'), [TENANT_ID, BUILDING_ID]);
  });

  it('derives the building from an active unit during creation', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row()] });
    await createTenantRepository({ query }).create(input, BUILDING_ID);
    const [statement, parameters] = query.mock.calls[0];
    expect(statement).toContain('JOIN buildings b ON b.id = u.building_id AND b.active = TRUE');
    expect(statement).toContain('FOR SHARE');
    expect(statement).not.toContain('INSERT INTO tenants (building_id');
    expect(parameters[0]).toBe(UNIT_ID);
    expect(parameters[16]).toBe(BUILDING_ID);
  });
});
