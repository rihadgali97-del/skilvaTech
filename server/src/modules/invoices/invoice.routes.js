import { Router } from 'express';
import * as invoiceController from './invoice.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createInvoiceSchema, updateInvoiceSchema, listInvoicesSchema } from './invoice.validation.js';

const router = Router();
router.use(authenticate);

router.get('/',         requirePermission('invoices:read'),   validate(listInvoicesSchema, 'query'), invoiceController.listInvoices);
router.get('/stats',    requirePermission('invoices:read'),   invoiceController.getStats);
router.get('/:id',      requirePermission('invoices:read'),   invoiceController.getInvoiceById);
router.get('/:id/pdf',  requirePermission('invoices:read'),   invoiceController.downloadInvoicePDF);

router.post('/',          requirePermission('invoices:create'), validate(createInvoiceSchema), invoiceController.createInvoice);
router.post('/:id/send',  requirePermission('invoices:update'), invoiceController.sendInvoice);
router.post('/:id/paid',  requirePermission('invoices:update'), invoiceController.markAsPaid);
router.post('/:id/cancel',requirePermission('invoices:update'), invoiceController.cancelInvoice);

router.patch('/:id',  requirePermission('invoices:update'), validate(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete('/:id', requirePermission('invoices:delete'), invoiceController.deleteInvoice);

export default router;