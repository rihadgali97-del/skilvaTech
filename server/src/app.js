import express from 'express';
import helmet from './shared/security/helmet.js';
import corsConfig from './shared/security/cors.js';
import { sanitize } from './shared/security/sanitize.js';
import { errorHandler, notFound } from './shared/middleware/error.middleware.js';
import { requestLogger } from './shared/logger/request.logger.js';
import { rateLimiter } from './shared/middleware/rateLimit.middleware.js';
import router from './routes/index.js';

const app = express();

app.use(helmet);
app.use(corsConfig);
app.use(sanitize);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/api', rateLimiter);
app.use('/api', router);
app.use(notFound);
app.use(errorHandler);

export default app;
