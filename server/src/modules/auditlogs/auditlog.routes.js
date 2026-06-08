import { Router } from 'express';
import { getAuditLogs } from './auditlog.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/', requirePermission('audit:read'), getAuditLogs);

export default router;