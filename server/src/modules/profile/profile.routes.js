import { Router } from 'express';
import * as profileController from './profile.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/',           profileController.getProfile);
router.patch('/',         profileController.updateProfile);
router.patch('/password', profileController.changePassword);

export default router;