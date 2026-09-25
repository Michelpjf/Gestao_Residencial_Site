import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import PizZip from 'pizzip';
import { createContractDocumentGenerator } from '../src/modules/contracts/contracts.document.js';

function fixture() {
  return {
    contractNumber: 1, createdAt: new Date('2026-09-24T00:00:00Z'), tenantName: 'Pessoa Fictícia',
    tenantCpf: '52998224725', tenantRg: '123456 SSP/GO', tenantBirthDate: '1990-05-10', tenantMaritalStatus: 'Solteira',
    tenantAddressGoiania: 'Rua Fictícia, 10', tenantAddressOrigin: 'Rua de Origem, 20', tenantPhone: '(62) 99999-0000',
    referenceOneName: 'Referência Um', referenceOnePhone: '(62) 99999-0001', referenceTwoName: 'Referência Dois',
    referenceTwoPhone: '(62) 99999-0002', occupationInstitution: null, commercialPhone: null, commercialAddress: null,
    unitSubdivision: 'Bloco A', unitIdentification: '101', unitType: 'quarto', rentAmount: '1250.50', termMonths: 3,
    startDate: '2026-10-01', endDate: '2027-01-01', templateVersion: 'temporada-v1',
  };
}

describe('contract DOCX generation', () => {
  it('fills the approved template without unresolved placeholders', async () => {
    const result = await createContractDocumentGenerator().generate(fixture());
    const zip = new PizZip(result.buffer);
    const xml = zip.file('word/document.xml').asText();
    expect(result.filename).toBe('contrato-temporada-001-pessoa-ficticia.docx');
    expect(xml).toContain('Pessoa Fictícia');
    expect(xml).toContain('CONTRATO DE LOCAÇÃO TEMPORADA 001/2026');
    expect(xml).toContain('Locação de Imóvel Tipo Residencial');
    expect(xml).toContain('3 mês(es)');
    expect(xml).toContain('529.982.247-25');
    expect(xml).toContain('R$ 1.250,50');
    expect(xml).toContain('01/10/2026');
    expect(xml).toContain('01/01/2027');
    expect(xml).not.toMatch(/\{[A-Z_]+\}|CAMPO05|XX{2,}/);
  });

  it('keeps the versioned template readable and containing all required tags', async () => {
    const template = await readFile(new URL('../src/modules/contracts/templates/temporada-v1.docx', import.meta.url));
    const xml = new PizZip(template).file('word/document.xml').asText();
    for (const tag of ['CONTRACT_NUMBER', 'TENANT_NAME', 'TENANT_CPF', 'TENANT_RG', 'UNIT_IDENTIFICATION', 'RENT_VALUE', 'TERM_MONTHS', 'START_DATE', 'END_DATE', 'ISSUE_DATE']) {
      expect(xml).toContain(`{${tag}}`);
    }
  });

  it('rejects external relationships and attached templates in the versioned DOCX', async () => {
    const template = await readFile(new URL('../src/modules/contracts/templates/temporada-v1.docx', import.meta.url));
    const zip = new PizZip(template);
    const relationships = Object.entries(zip.files)
      .filter(([name, entry]) => !entry.dir && name.endsWith('.rels'))
      .map(([, entry]) => entry.asText());

    expect(relationships).not.toContainEqual(expect.stringMatching(/TargetMode=["']External["']/i));
    expect(zip.file('word/settings.xml').asText()).not.toContain('attachedTemplate');
  });
});
