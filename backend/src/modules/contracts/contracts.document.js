import { readFile } from 'node:fs/promises';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

const templateUrl = new URL('./templates/temporada-v1.docx', import.meta.url);

function formatDate(value) {
  const iso = value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

function formatCpf(value) {
  return String(value).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function safeFilenamePart(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function templateData(contract) {
  const createdYear = new Date(contract.createdAt).getUTCFullYear();
  return {
    CONTRACT_NUMBER: `${String(contract.contractNumber).padStart(3, '0')}/${createdYear}`,
    TENANT_NAME: contract.tenantName,
    TENANT_CPF: formatCpf(contract.tenantCpf),
    TENANT_RG: contract.tenantRg,
    TENANT_BIRTH_DATE: formatDate(contract.tenantBirthDate),
    TENANT_MARITAL_STATUS: contract.tenantMaritalStatus,
    TENANT_ADDRESS_GOIANIA: contract.tenantAddressGoiania,
    TENANT_ADDRESS_ORIGIN: contract.tenantAddressOrigin,
    TENANT_PHONE: contract.tenantPhone,
    REFERENCE_ONE: `${contract.referenceOneName} / ${contract.referenceOnePhone}`,
    REFERENCE_TWO: `${contract.referenceTwoName} / ${contract.referenceTwoPhone}`,
    OCCUPATION_INSTITUTION: contract.occupationInstitution || 'Não informado',
    COMMERCIAL_PHONE: contract.commercialPhone || 'Não informado',
    COMMERCIAL_ADDRESS: contract.commercialAddress || 'Não informado',
    UNIT_IDENTIFICATION: `${contract.unitSubdivision ? `${contract.unitSubdivision} / ` : ''}${contract.unitIdentification}`,
    UNIT_CATEGORY: contract.unitType === 'loft' ? 'Loft' : 'Quarto',
    UNIT_CATEGORY_UPPER: contract.unitType === 'loft' ? 'LOFT' : 'QUARTO',
    RENT_VALUE: formatCurrency(contract.rentAmount),
    TERM_MONTHS: contract.termMonths,
    START_DATE: formatDate(contract.startDate),
    END_DATE: formatDate(contract.endDate),
    ISSUE_DATE: formatDate(contract.createdAt),
  };
}

export function createContractDocumentGenerator({ readTemplate = () => readFile(templateUrl) } = {}) {
  let templatePromise;
  return Object.freeze({
    async generate(contract) {
      templatePromise ||= readTemplate();
      const template = await templatePromise;
      const document = new Docxtemplater(new PizZip(template), {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter(part) { throw new Error(`Missing contract template value: ${part.value}`); },
      });
      document.render(templateData(contract));
      const number = String(contract.contractNumber).padStart(3, '0');
      const tenant = safeFilenamePart(contract.tenantName) || 'morador';
      return Object.freeze({
        buffer: document.toBuffer(),
        filename: `contrato-temporada-${number}-${tenant}.docx`,
      });
    },
  });
}
