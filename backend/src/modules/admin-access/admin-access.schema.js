import { z } from 'zod';
import { AppError } from '../../errors/app-error.js';

const userIdSchema = z.uuid();
const assignmentSchema = z.strictObject({
  displayName: z.string().trim().min(2).max(160),
  buildingId: z.uuid(),
});

export function parseManagerUserId(input) {
  const result = userIdSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, 'MANAGER_ID_INVALID', 'Manager id must be a valid UUID');
  }
  return result.data;
}

export function parseManagerAssignment(input) {
  const result = assignmentSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, 'MANAGER_ASSIGNMENT_INVALID', 'Manager assignment input is invalid');
  }
  return result.data;
}
