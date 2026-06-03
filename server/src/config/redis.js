import { createClient } from 'redis';
import { env } from './env.js';
import logger from './logger.js';

let redisClient = null;

export const connectRedis = async () => {
  redisClient = createClient({ url: env.REDIS_URL });
  redisClient.on('error', (err) => logger.error('Redis error', err));
  await redisClient.connect();
  return redisClient;
};

export const getRedis = () => {
  if (!redisClient) throw new Error('Redis not connected');
  return redisClient;
};

export default { connectRedis, getRedis };
