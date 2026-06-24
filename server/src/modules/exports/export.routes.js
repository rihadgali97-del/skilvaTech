import { Router } from 'express';
import { exportClients, exportLeads } from './export.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';

const router = Router();
router.use(authenticate);

// GET /api/v1/exports/clients → downloads clients.csv
router.get('/clients', requirePermission('clients:read'), exportClients);

// GET /api/v1/exports/leads → downloads leads.csv
router.get('/leads', requirePermission('clients:read'), exportLeads);

export default router;