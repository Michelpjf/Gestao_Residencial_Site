import { describe, expect, it, vi } from 'vitest';
import { createContractRepository } from '../src/modules/contracts/contracts.repository.js';

const BUILDING_ID = '0f99b81d-9cf1-4cfa-9331-e397fb02044d';
const TENANT_ID = '901e6a32-506d-4e27-8dff-fab7e1c4fd92';
const CONTRACT_ID = '7f2d9100-46d0-42cd-b854-445af2ddde3e';
function row() { return { id: CONTRACT_ID, contract_number: '1', tenant_id: TENANT_ID, rent_amount: '1250.50', term_months: 3, start_date: '2026-10-01', end_date: '2027-01-01', template_version: 'temporada-v1', created_at: new Date('2026-09-24T00:00:00Z'), updated_at: new Date('2026-09-24T00:00:00Z'), full_name: 'Pessoa Fictícia', unit_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', building_id: BUILDING_ID, unit_identification: '101', unit_subdivision: 'A', unit_type: 'quarto', building_name: 'Residencial', cpf: '52998224725', rg: '123', birth_date: '1990-05-10', marital_status: 'Solteiro', address_goiania: 'A', address_origin: 'B', phone: '1', reference_one_name: 'R1', reference_one_phone: '2', reference_two_name: 'R2', reference_two_phone: '3', occupation_institution: null, commercial_phone: null, commercial_address: null }; }

describe('contract repository', () => {
  it('lists summaries in the authorized building without personal document fields', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row()] });
    const result = await createContractRepository({ query }).listActive(BUILDING_ID);
    expect(result[0]).toMatchObject({ id: CONTRACT_ID, contractNumber: 1, buildingId: BUILDING_ID, tenantName: 'Pessoa Fictícia' });
    expect(result[0]).not.toHaveProperty('tenantCpf');
    expect(query).toHaveBeenCalledWith(expect.stringContaining('u.building_id = $1'), [BUILDING_ID]);
  });

  it('scopes detail through the tenant unit building', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row()] });
    await createContractRepository({ query }).findActive(CONTRACT_ID, BUILDING_ID);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('u.building_id = $2'), [CONTRACT_ID, BUILDING_ID]);
  });

  it('derives unit and building from the selected tenant during creation', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [row()] });
    await createContractRepository({ query }).create({ tenantId: TENANT_ID, rentAmount: '1250.50', termMonths: 3, startDate: '2026-10-01', endDate: '2027-01-01', templateVersion: 'temporada-v1' }, BUILDING_ID);
    const [statement, parameters] = query.mock.calls[0];
    expect(statement).toContain('JOIN buildings b ON b.id = u.building_id AND b.active = TRUE');
    expect(statement).toContain('FOR SHARE');
    expect(statement).not.toContain('INSERT INTO contracts (building_id');
    expect(parameters).toEqual([TENANT_ID, '1250.50', 3, '2026-10-01', '2027-01-01', 'temporada-v1', BUILDING_ID]);
  });
});
