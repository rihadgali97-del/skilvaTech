import { Router } from 'express';
import * as roleController from './role.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createRoleSchema, updateRoleSchema, assignPermissionsSchema } from './role.validation.js';

const router = Router();

router.use(authenticate);

router.get('/',    requirePermission('roles:read'),   roleController.listRoles);
router.get('/:id', requirePermission('roles:read'),   roleController.getRoleById);

router.post(
  '/',
  requirePermission('roles:create'),
  validate(createRoleSchema),
  roleController.createRole
);

router.patch(
  '/:id',
  requirePermission('roles:update'),
  validate(updateRoleSchema),
  roleController.updateRole
);

router.delete('/:id', requirePermission('roles:delete'), roleController.deleteRole);

// Assign permissions to a role (replaces all existing)
router.put(
  '/:id/permissions',
  requirePermission('roles:update'),
  validate(assignPermissionsSchema),
  roleController.assignPermissions
);

export default router;