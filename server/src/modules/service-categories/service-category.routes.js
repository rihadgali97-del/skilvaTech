import { Router } from 'express';
import * as categoryController from './service-category.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  listCategoriesSchema,
} from './service-category.validation.js';

const router = Router();

router.get('/', validate(listCategoriesSchema, 'query'), categoryController.listCategories);
router.get('/:id', categoryController.getCategoryById);

router.post('/',
  authenticate, requirePermission('services:create'),
  validate(createCategorySchema), categoryController.createCategory);

router.patch('/:id',
  authenticate, requirePermission('services:update'),
  validate(updateCategorySchema), categoryController.updateCategory);

router.delete('/:id',
  authenticate, requirePermission('services:delete'),
  categoryController.deleteCategory);

export default router;