import { z } from 'zod';

export const createServiceSchema = z.object({
  name:        z.string().min(2).max(100).trim(),
  slug:        z.string().min(2).max(100).trim().toLowerCase()
                 .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens')
                 .optional(),
  description: z.string().max(1000).optional(),
  content:     z.string().optional(),
  icon:        z.string().max(100).optional(),
  image:       z.string().url().optional(),
  price:       z.coerce.number().min(0).optional(),
  isActive:    z.boolean().default(true),
  isFeatured:  z.boolean().default(false),
  order:       z.coerce.number().default(0),
  categoryId:  z.string().min(1, 'Category is required'),
});

export const updateServiceSchema = createServiceSchema.partial();

export const listServicesSchema = z.object({
  page:       z.coerce.number().default(1),
  limit:      z.coerce.number().default(10),
  search:     z.string().optional(),
  categoryId: z.string().optional(),
  isActive:   z.enum(['true', 'false']).optional(),
  isFeatured: z.enum(['true', 'false']).optional(),
  sortBy:     z.enum(['createdAt', 'name', 'order', 'price']).default('order'),
  sortOrder:  z.enum(['asc', 'desc']).default('asc'),
});