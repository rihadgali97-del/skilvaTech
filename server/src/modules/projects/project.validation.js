// project.validation.js
import { z } from 'zod';

export const createProjectSchema = z.object({
  name:        z.string().min(2).max(200).trim(),
  description: z.string().optional(),
  status:      z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']).default('planning'),
  priority:    z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  startDate:   z.string().datetime().optional(),
  endDate:     z.string().datetime().optional(),
  budget:      z.coerce.number().min(0).optional(),
  clientId:    z.string().optional(),
  managerId:   z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const listProjectsSchema = z.object({
  page:      z.coerce.number().default(1),
  limit:     z.coerce.number().default(10),
  search:    z.string().optional(),
  status:    z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']).optional(),
  priority:  z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  clientId:  z.string().optional(),
  managerId: z.string().optional(),
  sortBy:    z.enum(['createdAt', 'name', 'startDate', 'endDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});