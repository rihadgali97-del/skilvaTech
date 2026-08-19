import { z } from 'zod';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(300),
  quantity:    z.coerce.number().min(1).default(1),
  unitPrice:   z.coerce.number().min(0),
});

export const createInvoiceSchema = z.object({
  clientId:  z.string().min(1, 'Client is required'),
  // Accept any non-empty string date (YYYY-MM-DD or ISO), empty string, or undefined
  dueDate:   z.string().optional()
               .transform((v) => {
                 if (!v || v.trim() === '') return undefined;
                 const d = new Date(v);
                 return isNaN(d.getTime()) ? undefined : d.toISOString();
               }),
  taxRate:   z.coerce.number().min(0).max(100).default(0).optional(),
  notes:     z.string().max(1000).optional().or(z.literal('')),
  terms:     z.string().max(1000).optional().or(z.literal('')),
  currency:  z.string().default('USD'),
  items:     z.array(invoiceItemSchema).min(1, 'At least one line item is required'),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
});

export const listInvoicesSchema = z.object({
  page:      z.coerce.number().default(1),
  limit:     z.coerce.number().default(10),
  search:    z.string().optional(),
  status:    z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  clientId:  z.string().optional(),
  sortBy:    z.enum(['createdAt', 'dueDate', 'amount', 'number']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});