import { Router } from 'express';
import * as leadController from './lead.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createLeadSchema, updateLeadSchema, listLeadsSchema } from './lead.validation.js';

const router = Router();
router.use(authenticate);

router.get('/',     requirePermission('clients:read'),   validate(listLeadsSchema, 'query'), leadController.listLeads);
router.get('/:id',  requirePermission('clients:read'),   leadController.getLeadById);
router.post('/',    requirePermission('clients:create'), validate(createLeadSchema), leadController.createLead);
router.patch('/:id', requirePermission('clients:update'), validate(updateLeadSchema), leadController.updateLead);
router.delete('/:id', requirePermission('clients:delete'), leadController.deleteLead);

export default router;