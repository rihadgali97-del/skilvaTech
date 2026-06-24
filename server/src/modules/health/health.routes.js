import { Router } from 'express';
import { healthCheck } from './health.controller.js';

const router = Router();

// Public — no auth. Used by Docker, nginx, uptime monitors, CI/CD.
router.get('/', healthCheck);

export default router;