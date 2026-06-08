import crypto from 'crypto';
import * as authRepo from './auth.repository.js';
import { hashPassword, comparePassword } from '../../shared/utils/password.utils.js';
import { generateTokenPair, verifyRefreshToken } from '../../shared/services/jwt.service.js';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../../shared/errors/AppError.js';

const sanitizeUser = (user) => { const { password, ...safe } = user; return safe; };
const buildTokenPayload = (user) => ({ id: user.id, email: user.email, role: user.role?.name });
const refreshExpiry = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

// Updated signature to take and verify confirmPassword
export const register = async ({ firstName, lastName, email, password, confirmPassword }) => {
  if (password !== confirmPassword) throw new BadRequestError('Passwords do not match');
  
  if (await authRepo.findUserByEmail(email)) throw new ConflictError('Email already registered');
  
  const defaultRole = await authRepo.findDefaultRole();
  if (!defaultRole) throw new Error('Default role not configured. Run seed first.');
  
  const user = await authRepo.createUser({ firstName, lastName, email, password: await hashPassword(password), roleId: defaultRole.id });
  const tokens = generateTokenPair(buildTokenPayload(user));
  await authRepo.saveRefreshToken(user.id, tokens.refreshToken, refreshExpiry());
  return { user: sanitizeUser(user), tokens };
};

export const login = async ({ email, password }) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');
  if (!await comparePassword(password, user.password)) throw new UnauthorizedError('Invalid credentials');
  const tokens = generateTokenPair(buildTokenPayload(user));
  await authRepo.saveRefreshToken(user.id, tokens.refreshToken, refreshExpiry());
  return { user: sanitizeUser(user), tokens };
};

export const refreshTokens = async (refreshToken) => {
  verifyRefreshToken(refreshToken);
  const stored = await authRepo.findRefreshToken(refreshToken);
  if (!stored || stored.expiresAt < new Date()) throw new UnauthorizedError('Refresh token invalid');
  const fullUser = await authRepo.findUserById(stored.user.id);
  const tokens = generateTokenPair(buildTokenPayload(fullUser));
  await authRepo.saveRefreshToken(fullUser.id, tokens.refreshToken, refreshExpiry());
  return { tokens };
};

export const logout = async (userId) => authRepo.deleteRefreshToken(userId);

export const getMe = async (userId) => {
  const user = await authRepo.findUserById(userId);
  if (!user) throw new NotFoundError('User');
  return sanitizeUser(user);
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await authRepo.findUserById(userId);
  if (!await comparePassword(currentPassword, user.password)) throw new BadRequestError('Current password is incorrect');
  await authRepo.updateUser(userId, { password: await hashPassword(newPassword) });
  await authRepo.deleteRefreshToken(userId);
};

export const forgotPassword = async (email) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) return;
  const token = crypto.randomBytes(32).toString('hex');
  await authRepo.createPasswordResetToken(user.id, token, new Date(Date.now() + 3600000));
  return token;
};

export const resetPassword = async ({ token, password }) => {
  const record = await authRepo.findPasswordResetToken(token);
  if (!record || record.expiresAt < new Date()) throw new BadRequestError('Invalid or expired reset token');
  await authRepo.updateUser(record.userId, { password: await hashPassword(password) });
  await authRepo.deletePasswordResetToken(record.userId);
  await authRepo.deleteRefreshToken(record.userId);
};