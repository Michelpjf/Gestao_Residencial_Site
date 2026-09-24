import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

const requiredText = (max) => z.string().max(max).transform((value) => value.trim()).refine(Boolean);
const optionalText = (max) => z.union([z.string().max(max), z.null()]).optional().transform((value) => {
  const trimmed = value?.trim();
  return trimmed || null;
});

function isValidCpf(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  const check = (length) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) sum += Number(digits[index]) * (length + 1 - index);
    const remainder = (sum * 10) % 11;
    return (remainder === 10 ? 0 : remainder) === Number(digits[length]);
  };
  return check(9) && check(10);
}

const cpf = z.string().max(32).regex(/^[\d.\-\s]+$/).refine(isValidCpf).transform((value) => value.replace(/\D/g, ''));
const birthDate = z.iso.date().refine((value) => value <= new Date().toISOString().slice(0, 10));

const inputSchema = z.strictObject({
  unitId: z.uuid(),
  fullName: requiredText(160),
  cpf,
  rg: requiredText(30),
  birthDate,
  maritalStatus: requiredText(40),
  addressGoiania: requiredText(300),
  addressOrigin: requiredText(300),
  phone: requiredText(30),
  referenceOneName: requiredText(160),
  referenceOnePhone: requiredText(30),
  referenceTwoName: requiredText(160),
  referenceTwoPhone: requiredText(30),
  occupationInstitution: optionalText(160),
  commercialPhone: optionalText(30),
  commercialAddress: optionalText(300),
});

export function parseTenantInput(input) {
  const result = inputSchema.safeParse(input);
  if (!result.success) throw new AppError(400, 'TENANT_INPUT_INVALID', 'Tenant input is invalid');
  return result.data;
}

export function parseTenantId(input) {
  const result = z.uuid().safeParse(input);
  if (!result.success) throw new AppError(400, 'TENANT_ID_INVALID', 'Tenant id must be a valid UUID');
  return result.data;
}
