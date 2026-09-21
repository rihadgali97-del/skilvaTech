import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import { sendSuccess } from '../../shared/utils/response.utils.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError.js';
import { uploadToCloudinary } from '../../shared/services/storage.service.js';

// GET /api/v1/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user.id },
      select: {
        id: true, firstName: true, lastName: true,
        email: true, phone: true, avatar: true,
        isActive: true, isEmailVerified: true,
        lastLoginAt: true, createdAt: true,
        role: { select: { id: true, name: true } },
      },
    });
    if (!user) throw new NotFoundError('User');
    sendSuccess(res, { user });
  } catch (err) { next(err); }
};

// PATCH /api/v1/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName  && { lastName }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true, firstName: true, lastName: true,
        email: true, phone: true, avatar: true,
        role: { select: { id: true, name: true } },
      },
    });

    sendSuccess(res, { user }, 'Profile updated');
  } catch (err) { next(err); }
};

// PATCH /api/v1/profile/avatar
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw new BadRequestError('No image file provided');

    const result = await uploadToCloudinary(req.file.buffer, {
      folder:         'skilvatech/avatars',
      transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
    });

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data:  { avatar: result.secure_url },
      select: { id: true, firstName: true, lastName: true, avatar: true },
    });

    sendSuccess(res, { user }, 'Avatar updated');
  } catch (err) { next(err); }
};

// PATCH /api/v1/profile/password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new BadRequestError('Current and new password are required');
    }
    if (newPassword.length < 8) {
      throw new BadRequestError('New password must be at least 8 characters');
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new BadRequestError('Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });

    sendSuccess(res, null, 'Password changed successfully');
  } catch (err) { next(err); }
};