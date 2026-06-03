import prisma from '../../config/db.js';

export const findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email }, include: { role: { include: { permissions: { include: { permission: true } } } } } });

export const findUserById = (id) =>
  prisma.user.findUnique({ where: { id }, include: { role: { include: { permissions: { include: { permission: true } } } } } });

export const createUser = (data) =>
  prisma.user.create({ data, include: { role: true } });

export const updateUser = (id, data) =>
  prisma.user.update({ where: { id }, data });

export const saveRefreshToken = (userId, token, expiresAt) =>
  prisma.refreshToken.upsert({ where: { userId }, create: { userId, token, expiresAt }, update: { token, expiresAt } });

export const findRefreshToken = (token) =>
  prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });

export const deleteRefreshToken = (userId) =>
  prisma.refreshToken.deleteMany({ where: { userId } });

export const createPasswordResetToken = (userId, token, expiresAt) =>
  prisma.passwordResetToken.upsert({ where: { userId }, create: { userId, token, expiresAt }, update: { token, expiresAt } });

export const findPasswordResetToken = (token) =>
  prisma.passwordResetToken.findUnique({ where: { token }, include: { user: true } });

export const deletePasswordResetToken = (userId) =>
  prisma.passwordResetToken.deleteMany({ where: { userId } });

export const findDefaultRole = () =>
  prisma.role.findFirst({ where: { isDefault: true } });
