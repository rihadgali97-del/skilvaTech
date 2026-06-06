// client.validation.js
import { z } from 'zod';

export const createClientSchema = z.object({
  name:    z.string().min(2).max(100).trim(),
  email:   z.string().email().toLowerCase().trim(),
  phone:   z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  notes:   z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const listClientsSchema = z.object({
  page:     z.coerce.number().default(1),
  limit:    z.coerce.number().default(10),
  search:   z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sortBy:   z.enum(['createdAt', 'name', 'company']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});