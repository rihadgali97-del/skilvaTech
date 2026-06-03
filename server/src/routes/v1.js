import { Router } from 'express';
import authRoutes            from '../modules/auth/auth.routes.js';
import userRoutes            from '../modules/users/user.routes.js';
import roleRoutes            from '../modules/roles/role.routes.js';
import permissionRoutes      from '../modules/permissions/permission.routes.js';
import serviceCategoryRoutes from '../modules/service-categories/service-category.routes.js';
import serviceRoutes         from '../modules/services/service.routes.js';

const router = Router();

router.use('/auth',               authRoutes);
router.use('/users',              userRoutes);
router.use('/roles',              roleRoutes);
router.use('/permissions',        permissionRoutes);
router.use('/service-categories', serviceCategoryRoutes);
router.use('/services',           serviceRoutes);

export default router;