import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';

const bootstrap = async () => {
  try {
    await connectDB();
    logger.info('✅ PostgreSQL connected');

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
