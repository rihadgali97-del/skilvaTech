import { z } from 'zod';

export const createCourseSchema = z.object({
  title:        z.string().min(3).max(200).trim(),
  slug:         z.string().min(2).max(200).toLowerCase()
                  .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens')
                  .optional(),
  description:  z.string().max(2000).optional(),
  content:      z.string().optional(),
  thumbnail:    z.string().url().optional(),
  price:        z.coerce.number().min(0).optional(),
  level:        z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  isPublished:  z.boolean().default(false),
  isFeatured:   z.boolean().default(false),
  duration:     z.coerce.number().min(0).optional(),
  order:        z.coerce.number().default(0),
  instructorId: z.string().min(1, 'Instructor is required'),
});

export const updateCourseSchema = createCourseSchema.partial();

export const listCoursesSchema = z.object({
  page:         z.coerce.number().default(1),
  limit:        z.coerce.number().default(10),
  search:       z.string().optional(),
  level:        z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  isPublished:  z.enum(['true', 'false']).optional(),
  isFeatured:   z.enum(['true', 'false']).optional(),
  instructorId: z.string().optional(),
  sortBy:       z.enum(['createdAt', 'title', 'price', 'order']).default('createdAt'),
  sortOrder:    z.enum(['asc', 'desc']).default('desc'),
});