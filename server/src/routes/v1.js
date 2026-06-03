import { Router } from 'express';
import authRoutes        from '../modules/auth/auth.routes.js';
import userRoutes        from '../modules/users/user.routes.js';
import roleRoutes        from '../modules/roles/role.routes.js';
import permissionRoutes  from '../modules/permissions/permission.routes.js';

// Phase 3+ routes will be added here as modules are built
// import serviceRoutes  from '../modules/services/service.routes.js';
// import courseRoutes   from '../modules/courses/course.routes.js';

const router = Router();

router.use('/auth',        authRoutes);
router.use('/users',       userRoutes);
router.use('/roles',       roleRoutes);
router.use('/permissions', permissionRoutes);

export default router;