import { getRedis } from '../../config/redis.js';
import logger from '../../config/logger.js';

const DEFAULT_TTL = 300;

export const getCache = async (key) => {
  try {
    const redis = getRedis();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.warn('Cache get failed', { key, error: err.message });
    return null;
  }
};

export const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  try {
    const redis = getRedis();
    await redis.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    logger.warn('Cache set failed', { key, error: err.message });
  }
};

export const deleteCache = async (key) => {
  try {
    const redis = getRedis();
    await redis.del(key);
  } catch (err) {
    logger.warn('Cache delete failed', { key, error: err.message });
  }
};

export const deleteCachePattern = async (pattern) => {
  try {
    const redis = getRedis();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(keys);
  } catch (err) {
    logger.warn('Cache pattern delete failed', { pattern, error: err.message });
  }
};

export const cacheMiddleware = (keyPrefix, ttl = DEFAULT_TTL) => {
  return async (req, res, next) => {
    const key = `${keyPrefix}:${JSON.stringify(req.query)}`;
    const cached = await getCache(key);

    if (cached) {
      return res.status(200).json({ success: true, data: cached, cached: true });
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (res.statusCode === 200 && body.success) {
        await setCache(key, body.data, ttl);
      }
      return originalJson(body);
    };

    return next();
  };
};
