import { Router } from 'express';
import { globalSearch } from './search.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/', globalSearch);

export default router;