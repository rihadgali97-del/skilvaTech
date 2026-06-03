import { z } from 'zod';

export const createCategorySchema = z.object({
  name:        z.string().min(2).max(100).trim(),
  slug:        z.string().min(2).max(100).trim().toLowerCase()
                 .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens')
                 .optional(),
  description: z.string().max(500).optional(),
  icon:        z.string().max(100).optional(),
  isActive:    z.boolean().default(true),
  order:       z.coerce.number().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export const listCategoriesSchema = z.object({
  isActive: z.enum(['true', 'false']).optional(),
});