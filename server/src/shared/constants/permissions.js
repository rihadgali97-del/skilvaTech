// ─── Permission naming convention: resource:action ───────────────────────────
export const PERMISSIONS = Object.freeze({
  // Users
  USERS_READ:   'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Roles
  ROLES_READ:   'roles:read',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',

  // Courses
  COURSES_READ:   'courses:read',
  COURSES_CREATE: 'courses:create',
  COURSES_UPDATE: 'courses:update',
  COURSES_DELETE: 'courses:delete',

  // Enrollments
  ENROLLMENTS_READ:   'enrollments:read',
  ENROLLMENTS_CREATE: 'enrollments:create',
  ENROLLMENTS_UPDATE: 'enrollments:update',

  // Projects
  PROJECTS_READ:   'projects:read',
  PROJECTS_CREATE: 'projects:create',
  PROJECTS_UPDATE: 'projects:update',
  PROJECTS_DELETE: 'projects:delete',

  // Tickets
  TICKETS_READ:   'tickets:read',
  TICKETS_CREATE: 'tickets:create',
  TICKETS_UPDATE: 'tickets:update',
  TICKETS_DELETE: 'tickets:delete',

  // Clients
  CLIENTS_READ:   'clients:read',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',

  // Analytics
  ANALYTICS_READ: 'analytics:read',

  // Settings
  SETTINGS_READ:   'settings:read',
  SETTINGS_UPDATE: 'settings:update',

  // Audit logs
  AUDIT_READ: 'audit:read',
});

export const PERMISSION_LIST = Object.values(PERMISSIONS);