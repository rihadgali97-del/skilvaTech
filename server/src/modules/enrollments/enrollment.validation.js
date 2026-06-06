// enrollment.validation.js
import { z } from 'zod';

export const enrollSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  courseId:  z.string().min(1, 'Course is required'),
});

export const updateProgressSchema = z.object({
  progress: z.coerce.number().min(0).max(100).optional(),
  status:   z.enum(['active', 'completed', 'cancelled']).optional(),
});

export const listEnrollmentsSchema = z.object({
  page:      z.coerce.number().default(1),
  limit:     z.coerce.number().default(10),
  studentId: z.string().optional(),
  courseId:  z.string().optional(),
  status:    z.enum(['active', 'completed', 'cancelled']).optional(),
  sortBy:    z.enum(['createdAt', 'progress']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});