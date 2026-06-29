import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import { env } from './config/env.js';
import { errorHandler } from './shared/middleware/error.middleware.js';
import { notFound } from './shared/middleware/error.middleware.js';
import v1Router from './routes/v1.js';
import healthRouter from './modules/health/health.routes.js';

const app = express();

// ── Security middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
  origin:      env.CORS_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true,
}));

// ── Request parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ────────────────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Rate limiting ──────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: { message: 'Too many requests, please try again later.' } },
}));

app.use('/api/v1/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: { message: 'Too many auth attempts, please try again later.' } },
}));

// ── Health check ───────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);

// ── API routes ─────────────────────────────────────────────────────────────────
app.use('/api/v1', v1Router);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use(notFound);

// ── Sentry error handler (must be before our error handler) ───────────────────
if (env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;