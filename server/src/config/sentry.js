import * as Sentry from '@sentry/node';
import { env } from './env.js';

export const initSentry = () => {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn:         env.SENTRY_DSN,
    environment: env.NODE_ENV || 'development',
    // Capture 100% of transactions in dev, 10% in production
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Don't send errors in test environment
    enabled: env.NODE_ENV !== 'test',
  });
};

export { Sentry };