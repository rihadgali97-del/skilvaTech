import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(2).max(50).trim(),
  lastName:  z.string().min(2).max(50).trim(),
  email:     z.string().email().toLowerCase().trim(),
  password:  z.string().min(8).regex(/[A-Z]/, 'Need uppercase').regex(/[0-9]/, 'Need number'),
  roleId:    z.string().min(1, 'Role is required'),
  phone:     z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).max(50).trim().optional(),
  lastName:  z.string().min(2).max(50).trim().optional(),
  phone:     z.string().optional(),
  avatar:    z.string().url().optional(),
});

export const updateUserRoleSchema = z.object({
  roleId: z.string().min(1, 'Role is required'),
});

export const listUsersSchema = z.object({
  page:    z.coerce.number().default(1),
  limit:   z.coerce.number().default(10),
  search:  z.string().optional(),
  roleId:  z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sortBy:   z.enum(['createdAt', 'firstName', 'lastName', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});