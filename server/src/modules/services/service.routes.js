import { Router } from 'express';
import * as serviceController from './service.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createServiceSchema, updateServiceSchema, listServicesSchema } from './service.validation.js';

const router = Router();

router.get('/',    validate(listServicesSchema, 'query'), serviceController.listServices);
router.get('/:id', serviceController.getServiceById);

router.post('/',   authenticate, requirePermission('services:create'), validate(createServiceSchema), serviceController.createService);
router.patch('/:id', authenticate, requirePermission('services:update'), validate(updateServiceSchema), serviceController.updateService);
router.delete('/:id', authenticate, requirePermission('services:delete'), serviceController.deleteService);

export default router;