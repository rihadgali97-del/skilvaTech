import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { authRateLimiter } from '../../shared/middleware/rateLimit.middleware.js';
import { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from './auth.validation.js';

const router = Router();

router.post('/register',        authRateLimiter, validate(registerSchema),      authController.register);
router.post('/login',           authRateLimiter, validate(loginSchema),          authController.login);
router.post('/refresh',         authRateLimiter, validate(refreshTokenSchema),   authController.refresh);
router.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password',  authRateLimiter, validate(resetPasswordSchema),  authController.resetPassword);

router.use(authenticate);
router.get('/me',               authController.getMe);
router.post('/logout',          authController.logout);
router.post('/change-password', validate(changePasswordSchema), authController.changePassword);

export default router;
