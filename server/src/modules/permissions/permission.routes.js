import { Router } from 'express';
import { getPermissions } from './permission.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';

const router = Router();

router.use(authenticate);

// Read-only — permissions are seeded, not created via API
router.get('/', requirePermission('roles:read'), getPermissions);

export default router;