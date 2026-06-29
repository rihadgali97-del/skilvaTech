import { Router } from 'express';
import { getActivity, getStats } from './dashboard.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/stats',    getStats);
router.get('/activity', getActivity);

export default router;