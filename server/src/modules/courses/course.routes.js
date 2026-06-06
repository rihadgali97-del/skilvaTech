import { Router } from 'express';
import * as courseController from './course.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createCourseSchema, updateCourseSchema, listCoursesSchema } from './course.validation.js';
import lessonRouter from '../lessons/lesson.routes.js';

const router = Router();

// Nest lessons under courses: /courses/:courseId/lessons
router.use('/:courseId/lessons', lessonRouter);

// Public
router.get('/',    validate(listCoursesSchema, 'query'), courseController.listCourses);
router.get('/:id', courseController.getCourseById);

// Protected
router.post('/',     authenticate, requirePermission('courses:create'), validate(createCourseSchema), courseController.createCourse);
router.patch('/:id', authenticate, requirePermission('courses:update'), validate(updateCourseSchema), courseController.updateCourse);
router.delete('/:id',authenticate, requirePermission('courses:delete'), courseController.deleteCourse);

export default router;