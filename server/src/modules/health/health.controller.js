import prisma from '../../config/db.js';
import { getRedis } from '../../config/redis.js';
import logger from '../../config/logger.js';

export const healthCheck = async (req, res) => {
  const start = Date.now();
  const checks = { database: 'ok', redis: 'ok', uptime: process.uptime() };
  let status = 200;

  // ── PostgreSQL ──────────────────────────────────────────────────────────────
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch (err) {
    checks.database = 'error';
    checks.databaseError = err.message;
    status = 503;
    logger.error('Health check: database failed', { error: err.message });
  }

  // ── Redis ───────────────────────────────────────────────────────────────────
  try {
    const redis = getRedis();
    if (redis) {
      await redis.ping();
      checks.redis = 'ok';
    } else {
      checks.redis = 'not_configured';
    }
  } catch (err) {
    checks.redis = 'error';
    checks.redisError = err.message;
    // Redis failure is a warning, not fatal — app still runs without it
    logger.warn('Health check: redis failed', { error: err.message });
  }

  checks.responseTimeMs = Date.now() - start;
  checks.environment    = process.env.NODE_ENV;
  checks.timestamp      = new Date().toISOString();

  res.status(status).json({
    status: status === 200 ? 'ok' : 'degraded',
    ...checks,
  });
};