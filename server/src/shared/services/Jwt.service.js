import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UnauthorizedError } from '../errors/AppError.js';

export const generateAccessToken  = (payload) => jwt.sign(payload, env.JWT_ACCESS_SECRET,  { expiresIn: env.JWT_ACCESS_EXPIRES,  issuer: 'skilvatech' });
export const generateRefreshToken = (payload) => jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES, issuer: 'skilvatech' });

export const verifyAccessToken  = (token) => jwt.verify(token, env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (token) => {
  try { return jwt.verify(token, env.JWT_REFRESH_SECRET); }
  catch { throw new UnauthorizedError('Invalid or expired refresh token'); }
};

export const generateTokenPair = (payload) => ({
  accessToken:  generateAccessToken(payload),
  refreshToken: generateRefreshToken({ id: payload.id }),
});

export default { generateTokenPair, verifyAccessToken, verifyRefreshToken };
