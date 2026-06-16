import app from './app.js';
import { env } from './config/env.js';
import { connectDB, prisma } from './config/db.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import logger from './config/logger.js';

const bootstrap = async () => {
  let server;

  try {
    await connectDB();
    logger.info('✅ PostgreSQL connected');

    if (env.REDIS_URL) {
      await connectRedis();
      logger.info('✅ Redis connected');

      const { startEmailWorker } = await import('./queues/email.queue.js');
      const { startNotificationWorker } = await import('./queues/notification.queue.js');

      startEmailWorker();
      startNotificationWorker();
    }

    server = app.listen(env.PORT);
    server.on('listening', () => {
      logger.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
    server.on('error', (error) => {
      logger.error('❌ Failed to start server', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('❌ Failed to start server', error);
    process.exit(1);
  }

  const shutdown = async (signal) => {
    logger.info(`${signal} received - shutting down gracefully`);

    if (server) {
      server.close(async () => {
        await disconnectRedis();
        await prisma.$disconnect();
        logger.info('Server closed');
        process.exit(0);
      });
      return;
    }

    await disconnectRedis();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

bootstrap();
