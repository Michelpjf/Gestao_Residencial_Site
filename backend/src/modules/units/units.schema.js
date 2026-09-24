import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

const text = z.string().max(80).refine((value) => value.trim().length > 0);
const inputSchema = z.strictObject({
  identification: text,
  subdivision: z.union([z.string().max(80), z.null()]).optional(),
  type: z.enum(['quarto', 'loft']),
});

export function parseUnitInput(input) {
  const result = inputSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, 'UNIT_INPUT_INVALID', 'Unit input is invalid');
  }
  return {
    ...result.data,
    subdivision: result.data.subdivision?.trim() ? result.data.subdivision : null,
  };
}

export function parseUnitId(input) {
  const result = z.uuid().safeParse(input);
  if (!result.success) throw new AppError(400, 'UNIT_ID_INVALID', 'Unit id must be a valid UUID');
  return result.data;
}
