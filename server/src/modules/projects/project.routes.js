import { Router } from 'express';
import * as projectController from './project.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createProjectSchema, updateProjectSchema, listProjectsSchema } from './project.validation.js';

const router = Router();
router.use(authenticate);

router.get('/',     requirePermission('projects:read'),   validate(listProjectsSchema, 'query'), projectController.listProjects);
router.get('/:id',  requirePermission('projects:read'),   projectController.getProjectById);
router.post('/',    requirePermission('projects:create'), validate(createProjectSchema), projectController.createProject);
router.patch('/:id', requirePermission('projects:update'), validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', requirePermission('projects:delete'), projectController.deleteProject);

export default router;