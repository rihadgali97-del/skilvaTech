import { Router } from 'express';
import authRoutes            from '../modules/auth/auth.routes.js';
import userRoutes            from '../modules/users/user.routes.js';
import roleRoutes            from '../modules/roles/role.routes.js';
import permissionRoutes      from '../modules/permissions/permission.routes.js';
import serviceCategoryRoutes from '../modules/service-categories/service-category.routes.js';
import serviceRoutes         from '../modules/services/service.routes.js';
import courseRoutes          from '../modules/courses/course.routes.js';
import enrollmentRoutes      from '../modules/enrollments/enrollment.routes.js';
import clientRoutes          from '../modules/clients/client.routes.js';
import leadRoutes            from '../modules/leads/lead.routes.js';
import projectRoutes         from '../modules/projects/project.routes.js';
import ticketRoutes          from '../modules/tickets/ticket.routes.js';
import notificationRoutes    from '../modules/notifications/notification.routes.js';
import auditLogRoutes        from '../modules/auditlogs/auditlog.routes.js';
import uploadRoutes          from '../modules/uploads/upload.routes.js';
import exportRoutes          from '../modules/exports/export.routes.js';

const router = Router();

router.use('/auth',               authRoutes);
router.use('/users',              userRoutes);
router.use('/roles',              roleRoutes);
router.use('/permissions',        permissionRoutes);
router.use('/service-categories', serviceCategoryRoutes);
router.use('/services',           serviceRoutes);
router.use('/courses',            courseRoutes);
router.use('/enrollments',        enrollmentRoutes);
router.use('/clients',            clientRoutes);
router.use('/leads',              leadRoutes);
router.use('/projects',           projectRoutes);
router.use('/tickets',            ticketRoutes);
router.use('/notifications',      notificationRoutes);
router.use('/audit-logs',         auditLogRoutes);
router.use('/uploads',            uploadRoutes);
router.use('/exports',            exportRoutes);

export default router;