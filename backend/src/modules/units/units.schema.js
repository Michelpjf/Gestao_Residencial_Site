import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

const text = z.string().max(80).refine((value) => value.trim().length > 0);
const inputSchema = z.strictObject({
  identification: text,
  subdivision: z.union([z.string().max(80), z.null()]).optional(),
  type: z.enum(['quarto', 'loft']),
});
const batchInputSchema = z.strictObject({
  units: z.array(inputSchema).min(1).max(200),
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

export function parseUnitBatchInput(input) {
  const result = batchInputSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, 'UNIT_BATCH_INPUT_INVALID', 'Unit batch input is invalid');
  }
  const units = result.data.units.map((unit) => ({
    ...unit,
    subdivision: unit.subdivision?.trim() ? unit.subdivision : null,
  }));
  const normalized = new Set();
  for (const unit of units) {
    const key = `${unit.subdivision?.trim().toLowerCase() || ''}\u0000${unit.identification.trim().toLowerCase()}`;
    if (normalized.has(key)) {
      throw new AppError(409, 'UNIT_BATCH_DUPLICATE', 'Unit batch contains duplicate identifications');
    }
    normalized.add(key);
  }
  return units;
}

export function parseUnitId(input) {
  const result = z.uuid().safeParse(input);
  if (!result.success) throw new AppError(400, 'UNIT_ID_INVALID', 'Unit id must be a valid UUID');
  return result.data;
}
