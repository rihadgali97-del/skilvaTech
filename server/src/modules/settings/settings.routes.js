import { Router } from 'express';
import * as settingsController from './settings.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requireRole } from '../../shared/middleware/permissions.middleware.js';

const router = Router();

// Public — no auth required (brand color, platform name, etc.)
router.get('/public', settingsController.getPublicSettings);

// All below require authentication + admin role
router.use(authenticate);
router.use(requireRole('super_admin', 'admin'));

router.get('/',                      settingsController.getAllSettings);
router.get('/system',                settingsController.getSystemInfo);
router.patch('/',                    settingsController.updateManySettings);
router.patch('/:key',                settingsController.updateSetting);
router.post('/reset/:group',         settingsController.resetGroup);
router.post('/test-email',           settingsController.sendTestEmail);

export default router;