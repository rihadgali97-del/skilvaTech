import { Router } from 'express';
import * as userController from './user.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import {
  createUserSchema,
  updateUserSchema,
  updateUserRoleSchema,
  listUsersSchema,
} from './user.validation.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// ─── List & create ────────────────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('users:read'),
  validate(listUsersSchema, 'query'),
  userController.listUsers
);

router.post(
  '/',
  requirePermission('users:create'),
  validate(createUserSchema),
  userController.createUser
);

// ─── Single user ──────────────────────────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('users:read'),
  userController.getUserById
);

router.patch(
  '/:id',
  requirePermission('users:update'),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  requirePermission('users:delete'),
  userController.deleteUser
);

// ─── Role assignment ──────────────────────────────────────────────────────────
router.patch(
  '/:id/role',
  requirePermission('users:update'),
  validate(updateUserRoleSchema),
  userController.updateUserRole
);

// ─── Activate / deactivate ────────────────────────────────────────────────────
router.patch('/:id/activate',   requirePermission('users:update'), userController.activateUser);
router.patch('/:id/deactivate', requirePermission('users:update'), userController.deactivateUser);

export default router;