// lesson.validation.js
import { z } from 'zod';

export const createLessonSchema = z.object({
  title:       z.string().min(2).max(200).trim(),
  slug:        z.string().min(2).max(200).toLowerCase()
                 .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens')
                 .optional(),
  content:     z.string().optional(),
  videoUrl:    z.string().url().optional(),
  duration:    z.coerce.number().min(0).optional(),
  order:       z.coerce.number().default(0),
  isPublished: z.boolean().default(false),
  isFree:      z.boolean().default(false),
});

export const updateLessonSchema = createLessonSchema.partial();