import { Router } from 'express';
import * as lessonController from './lesson.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createLessonSchema, updateLessonSchema } from './lesson.validation.js';

// mergeParams: true gives access to :courseId from the parent course router
const router = Router({ mergeParams: true });

router.get('/',    lessonController.listLessons);
router.get('/:id', lessonController.getLessonById);

router.post('/',
  authenticate, requirePermission('courses:create'),
  validate(createLessonSchema),
  lessonController.createLesson
);

router.patch('/:id',
  authenticate, requirePermission('courses:update'),
  validate(updateLessonSchema),
  lessonController.updateLesson
);

router.delete('/:id',
  authenticate, requirePermission('courses:delete'),
  lessonController.deleteLesson
);

export default router;