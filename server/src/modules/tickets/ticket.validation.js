import { z } from 'zod';

// Helper function to safely transform empty input elements "" into undefined
const emptyToUndefined = () => z.string().trim().optional().or(z.literal('')).transform(val => val === '' ? undefined : val);

export const createTicketSchema = z.object({
  title:        z.string().min(3, "Title must be at least 3 characters").max(200).trim(),
  description:  z.string().trim().optional().or(z.literal('')), // Allows clean handling of empty text boxes
  status:       z.enum(['open', 'in_progress', 'resolved', 'closed']).default('open'),
  priority:     z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  type:         z.enum(['support', 'bug', 'feature', 'maintenance']).default('support'),
  projectId:    emptyToUndefined(),
  assignedToId: emptyToUndefined(),
});

// Avoid using .partial() blindly if it forces default values onto partial updates
export const updateTicketSchema = z.object({
  title:        z.string().min(3).max(200).trim().optional(),
  description:  z.string().trim().optional().or(z.literal('')),
  status:       z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority:     z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  type:         z.enum(['support', 'bug', 'feature', 'maintenance']).optional(),
  projectId:    emptyToUndefined(),
  assignedToId: emptyToUndefined(),
});

export const listTicketsSchema = z.object({
  page:         z.coerce.number().int().positive().default(1),
  limit:        z.coerce.number().int().positive().default(10),
  search:       z.string().optional(),
  status:       z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority:     z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  type:         z.enum(['support', 'bug', 'feature', 'maintenance']).optional(),
  projectId:    z.string().optional(),
  assignedToId: z.string().optional(),
  sortBy:       z.enum(['createdAt', 'title', 'priority', 'status']).default('createdAt'),
  sortOrder:    z.enum(['asc', 'desc']).default('desc'),
});