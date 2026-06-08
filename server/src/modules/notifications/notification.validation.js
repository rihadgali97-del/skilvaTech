// notification.validation.js
import { z } from 'zod';

export const createNotificationSchema = z.object({
  title:   z.string().min(1).max(200).trim(),
  message: z.string().min(1).max(1000).trim(),
  type:    z.enum(['info', 'success', 'warning', 'error']).default('info'),
  link:    z.string().url().optional(),
  userId:  z.string().min(1, 'User is required'),
});

export const listNotificationsSchema = z.object({
  page:   z.coerce.number().default(1),
  limit:  z.coerce.number().default(20),
  isRead: z.enum(['true', 'false']).optional(),
});