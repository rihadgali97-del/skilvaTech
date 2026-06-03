import { verifyAccessToken } from '../services/jwt.service.js';
import { UnauthorizedError } from '../errors/AppError.js';
import prisma from '../../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedError('No token provided');

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true, email: true, firstName: true, lastName: true, isActive: true,
        role: {
          select: {
            id: true, name: true,
            permissions: { select: { permission: { select: { name: true } } } },
          },
        },
      },
    });

    if (!user) throw new UnauthorizedError('User not found');
    if (!user.isActive) throw new UnauthorizedError('Account deactivated');

    req.user = {
      ...user,
      permissions: user.role?.permissions.map((rp) => rp.permission.name) ?? [],
    };

    next();
  } catch (err) {
    next(err);
  }
};
