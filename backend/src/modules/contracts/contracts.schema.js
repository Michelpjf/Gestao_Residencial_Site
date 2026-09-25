import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

const date = z.iso.date();
const inputSchema = z.strictObject({
  tenantId: z.uuid(),
  rentAmount: z.string().regex(/^\d{1,10}(\.\d{1,2})?$/).refine((value) => Number(value) > 0),
  termMonths: z.number().int().min(1).max(36),
  startDate: date,
  endDate: date,
}).refine((value) => value.endDate > value.startDate);

export function parseContractInput(input) {
  const result = inputSchema.safeParse(input);
  if (!result.success) throw new AppError(400, 'CONTRACT_INPUT_INVALID', 'Contract input is invalid');
  return result.data;
}

export function parseContractId(input) {
  const result = z.uuid().safeParse(input);
  if (!result.success) throw new AppError(400, 'CONTRACT_ID_INVALID', 'Contract id must be a valid UUID');
  return result.data;
}
