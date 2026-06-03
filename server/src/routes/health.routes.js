import { Router } from 'express';
import prisma from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const checks = { status: 'ok', timestamp: new Date().toISOString(), services: {} };
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.services.database = 'ok';
  } catch {
    checks.services.database = 'error';
    checks.status = 'degraded';
  }
  const statusCode = checks.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(checks);
});

export default router;
