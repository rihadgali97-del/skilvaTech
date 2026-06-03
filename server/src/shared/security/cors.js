import cors from 'cors';
import { env } from '../../config/env.js';

const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());

export default cors({
  origin: (origin, callback) => {
    if (!origin && env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
