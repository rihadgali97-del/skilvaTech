import morgan from 'morgan';
import logger from '../../config/logger.js';
import { env } from '../../config/env.js';

// Stream morgan output through winston
const stream = { write: (msg) => logger.http(msg.trim()) };

export const requestLogger = morgan(
  env.NODE_ENV === 'production' ? 'combined' : 'dev',
  { stream }
);