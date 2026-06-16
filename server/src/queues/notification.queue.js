import { Queue, Worker } from 'bullmq';
import logger from '../config/logger.js';
import { sendNotification } from '../modules/notifications/notification.service.js';

const connection = {
  host: '127.0.0.1',
  port: 6379,
};

export const notificationQueue = new Queue('notification', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'fixed', delay: 3000 },
    removeOnComplete: { count: 200 },
    removeOnFail:     { count: 100 },
  },
});

export const startNotificationWorker = () => {
  const worker = new Worker(
    'notification',
    async (job) => {
      await sendNotification(job.data);
    },
    { connection, concurrency: 10 }
  );

  worker.on('completed', (job) => {
    logger.info(`Notification job completed`, { jobId: job.id });
  });

  worker.on('failed', (job, err) => {
    logger.error('Notification job failed', { jobId: job?.id, error: err.message });
  });

  logger.info('✅ Notification worker started');
  return worker;
};

export const queueNotification = (data) => notificationQueue.add('send', data);