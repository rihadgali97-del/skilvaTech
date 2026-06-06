import { Router } from 'express';
import * as enrollmentController from './enrollment.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { enrollSchema, updateProgressSchema, listEnrollmentsSchema } from './enrollment.validation.js';

const router = Router();

router.use(authenticate);

router.get('/',
  requirePermission('enrollments:read'),
  validate(listEnrollmentsSchema, 'query'),
  enrollmentController.listEnrollments
);

router.post('/',
  requirePermission('enrollments:create'),
  validate(enrollSchema),
  enrollmentController.enrollStudent
);

router.patch('/:id/progress',
  requirePermission('enrollments:update'),
  validate(updateProgressSchema),
  enrollmentController.updateProgress
);

router.patch('/:id/cancel',
  requirePermission('enrollments:update'),
  enrollmentController.cancelEnrollment
);

export default router;