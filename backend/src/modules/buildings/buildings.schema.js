import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

const buildingNameSchema = z.string().trim().min(2).max(160);
const buildingInputSchema = z.strictObject({ name: buildingNameSchema });
const buildingIdSchema = z.uuid();

export function parseBuildingInput(input) {
  const result = buildingInputSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, 'BUILDING_INPUT_INVALID', 'Building input is invalid');
  }
  return result.data;
}

export function parseBuildingId(input) {
  const result = buildingIdSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, 'BUILDING_ID_INVALID', 'Building id must be a valid UUID');
  }
  return result.data;
}
