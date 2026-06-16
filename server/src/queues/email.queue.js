import { Queue, Worker } from 'bullmq';
import { env } from '../config/env.js';
import logger from '../config/logger.js';
import {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendTicketCreatedEmail,
} from '../shared/services/email.service.js';

const connection = {
  host: '127.0.0.1',
  port: 6379,
};

export const emailQueue = new Queue('email', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail:     { count: 500 },
  },
});

export const startEmailWorker = () => {
  const worker = new Worker(
    'email',
    async (job) => {
      logger.info(`Processing email job: ${job.name}`, { jobId: job.id });

      switch (job.name) {
        case 'welcome':
          await sendWelcomeEmail(job.data.user);
          break;
        case 'password-reset':
          await sendPasswordResetEmail(job.data.user, job.data.token);
          break;
        case 'ticket-created':
          await sendTicketCreatedEmail(job.data.ticket, job.data.assignee);
          break;
        case 'custom':
          await sendEmail(job.data);
          break;
        default:
          logger.warn(`Unknown email job type: ${job.name}`);
      }
    },
    { connection, concurrency: 5 }
  );

  worker.on('completed', (job) => {
    logger.info(`Email job completed: ${job.name}`, { jobId: job.id });
  });

  worker.on('failed', (job, err) => {
    logger.error(`Email job failed: ${job?.name}`, { jobId: job?.id, error: err.message });
  });

  logger.info('✅ Email worker started');
  return worker;
};

export const queueWelcomeEmail  = (user)           => emailQueue.add('welcome',        { user });
export const queuePasswordReset = (user, token)    => emailQueue.add('password-reset', { user, token });
export const queueTicketEmail   = (ticket, assignee) => emailQueue.add('ticket-created', { ticket, assignee });
export const queueCustomEmail   = (emailData)      => emailQueue.add('custom',         emailData);