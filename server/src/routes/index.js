import { Router } from 'express';
import v1Router from './v1.js';
import healthRouter from './health.routes.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/v1', v1Router);

export default router;
