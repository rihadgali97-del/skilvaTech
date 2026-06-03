import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';

// ─── Phase 2+ routes will be added here as modules are built ─────────────────
// import userRoutes  from '../modules/users/user.routes.js';
// import roleRoutes  from '../modules/roles/role.routes.js';
// ...

const router = Router();

router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/roles', roleRoutes);

export default router;