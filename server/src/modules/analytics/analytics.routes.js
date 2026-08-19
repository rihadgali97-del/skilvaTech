import { Router } from 'express';
import * as analyticsController from './analytics.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';

const router = Router();
router.use(authenticate);
router.use(requirePermission('analytics:read'));

router.get('/overview',     analyticsController.getOverview);
router.get('/revenue',      analyticsController.getRevenueChart);
router.get('/leads',        analyticsController.getLeadsFunnel);
router.get('/tickets',      analyticsController.getTicketsAnalytics);
router.get('/enrollments',  analyticsController.getEnrollmentsAnalytics);
router.get('/clients',      analyticsController.getClientsAnalytics);

export default router;