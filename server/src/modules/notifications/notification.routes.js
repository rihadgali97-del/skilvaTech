import { Router } from 'express';
import * as notifController from './notification.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requireRole } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createNotificationSchema, listNotificationsSchema } from './notification.validation.js';

const router = Router();
router.use(authenticate);

router.get('/',    validate(listNotificationsSchema, 'query'), notifController.listNotifications);
router.post('/',   requireRole('super_admin', 'admin'), validate(createNotificationSchema), notifController.createNotification);

router.patch('/read-all',        notifController.markAllAsRead);
router.delete('/clear-read',     notifController.clearRead);
router.patch('/:id/read',        notifController.markAsRead);
router.delete('/:id',            notifController.deleteNotification);

export default router;