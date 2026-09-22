import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendSuccess } from '../../shared/utils/response.utils.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError.js';
import { sendPasswordResetEmail } from '../../shared/services/email.service.js';

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new BadRequestError('Email is required');

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success even if user not found — prevents email enumeration
    if (!user) {
      return sendSuccess(res, null, 'If that email exists, a reset link has been sent');
    }

    // Delete any existing reset token for this user
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // Generate a secure random token
    const rawToken   = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await prisma.passwordResetToken.create({
      data: {
        token:     hashedToken,
        userId:    user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send email with the raw token (not the hash)
    await sendPasswordResetEmail(user, rawToken);

    sendSuccess(res, null, 'If that email exists, a reset link has been sent');
  } catch (err) { next(err); }
};

// POST /api/v1/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new BadRequestError('Token and new password are required');
    }
    if (newPassword.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters');
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!resetRecord) throw new BadRequestError('Invalid or expired reset token');
    if (resetRecord.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token: hashedToken } });
      throw new BadRequestError('Reset token has expired — please request a new one');
    }

    // Update password
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data:  { password: hashed },
    });

    // Delete the used token
    await prisma.passwordResetToken.delete({ where: { token: hashedToken } });

    // Also invalidate all refresh tokens for security
    await prisma.refreshToken.deleteMany({ where: { userId: resetRecord.userId } });

    sendSuccess(res, null, 'Password reset successfully — you can now log in');
  } catch (err) { next(err); }
};

// POST /api/v1/auth/verify-reset-token
// Quick check so the frontend can validate the token before showing the form
export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw new BadRequestError('Token is required');

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const record = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestError('Invalid or expired token');
    }

    sendSuccess(res, { valid: true }, 'Token is valid');
  } catch (err) { next(err); }
};