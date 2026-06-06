import { Router } from 'express';
import * as clientController from './client.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createClientSchema, updateClientSchema, listClientsSchema } from './client.validation.js';

const router = Router();
router.use(authenticate);

router.get('/',    requirePermission('clients:read'),   validate(listClientsSchema, 'query'), clientController.listClients);
router.get('/:id', requirePermission('clients:read'),   clientController.getClientById);
router.post('/',   requirePermission('clients:create'), validate(createClientSchema), clientController.createClient);
router.patch('/:id', requirePermission('clients:update'), validate(updateClientSchema), clientController.updateClient);
router.delete('/:id', requirePermission('clients:delete'), clientController.deleteClient);

export default router;