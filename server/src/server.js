import { initSentry } from './config/sentry.js';

// Sentry must be initialized before any other imports
initSentry();

import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import logger from './config/logger.js';

const bootstrap = async () => {
  try {
    // ── Connect PostgreSQL ────────────────────────────────────────────────────
    await connectDB();
    logger.info('✅ PostgreSQL connected');

    // ── Connect Redis + start workers (optional) ──────────────────────────────
    if (env.REDIS_URL) {
      try {
        await connectRedis();
        logger.info('✅ Redis connected');

        try {
          const { startEmailWorker }        = await import('./queues/email.queue.js');
          const { startNotificationWorker } = await import('./queues/notification.queue.js');
          startEmailWorker();
          startNotificationWorker();
        } catch (queueErr) {
          logger.warn('⚠️  Queue workers failed to start — continuing without queues', {
            error: queueErr.message,
          });
        }

      } catch (redisErr) {
        logger.warn('⚠️  Redis connection failed — continuing without Redis', {
          error: redisErr.message,
        });
      }
    }

    // ── Start HTTP server ─────────────────────────────────────────────────────
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down`);
      server.close(async () => {
        const { prisma } = await import('./config/db.js');
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server', error);
    process.exit(1);
  }
};

bootstrap();