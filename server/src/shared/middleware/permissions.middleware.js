import { ForbiddenError } from '../errors/AppError.js';
import { ROLES } from '../constants/roles.js';

export const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (req.user?.role?.name === ROLES.SUPER_ADMIN) return next();
    const userPermissions = req.user?.permissions ?? [];
    const hasAll = permissions.every((p) => userPermissions.includes(p));
    if (!hasAll) return next(new ForbiddenError(`Required permissions: ${permissions.join(', ')}`));
    next();
  };
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role?.name))
      return next(new ForbiddenError(`Required roles: ${roles.join(', ')}`));
    next();
  };
};
