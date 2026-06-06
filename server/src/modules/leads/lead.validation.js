// lead.validation.js
import { z } from 'zod';

export const createLeadSchema = z.object({
  name:         z.string().min(2).max(100).trim(),
  email:        z.string().email().toLowerCase().trim(),
  phone:        z.string().optional(),
  company:      z.string().optional(),
  source:       z.enum(['website', 'referral', 'social', 'email', 'phone', 'other']).optional(),
  status:       z.enum(['new', 'contacted', 'qualified', 'lost', 'converted']).default('new'),
  notes:        z.string().optional(),
  value:        z.coerce.number().min(0).optional(),
  clientId:     z.string().optional(),
  assignedToId: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const listLeadsSchema = z.object({
  page:     z.coerce.number().default(1),
  limit:    z.coerce.number().default(10),
  search:   z.string().optional(),
  status:   z.enum(['new', 'contacted', 'qualified', 'lost', 'converted']).optional(),
  source:   z.string().optional(),
  assignedToId: z.string().optional(),
  sortBy:   z.enum(['createdAt', 'name', 'value', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});