import { z } from 'zod';

export const createRoleSchema = z.object({
  name:        z.string().min(2).max(50).trim().toLowerCase(),
  description: z.string().max(200).optional(),
});

export const updateRoleSchema = z.object({
  description: z.string().max(200).optional(),
});

export const assignPermissionsSchema = z.object({
  permissionIds: z.array(z.string()).min(1, 'At least one permission required'),
});