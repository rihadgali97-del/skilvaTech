// permission.service.js
import { findAllPermissions } from './permission.repository.js';

// Group permissions by resource for easier UI rendering
// Returns: { users: [...], courses: [...], ... }
export const listPermissions = async () => {
  const permissions = await findAllPermissions();

  const grouped = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) acc[permission.resource] = [];
    acc[permission.resource].push(permission);
    return acc;
  }, {});

  return { permissions, grouped };
};