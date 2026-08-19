export const PERMISSIONS = Object.freeze({
  USERS_READ:   'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  ROLES_READ:   'roles:read',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',

  SERVICES_READ:   'services:read',
  SERVICES_CREATE: 'services:create',
  SERVICES_UPDATE: 'services:update',
  SERVICES_DELETE: 'services:delete',

  COURSES_READ:   'courses:read',
  COURSES_CREATE: 'courses:create',
  COURSES_UPDATE: 'courses:update',
  COURSES_DELETE: 'courses:delete',

  ENROLLMENTS_READ:   'enrollments:read',
  ENROLLMENTS_CREATE: 'enrollments:create',
  ENROLLMENTS_UPDATE: 'enrollments:update',

  PROJECTS_READ:   'projects:read',
  PROJECTS_CREATE: 'projects:create',
  PROJECTS_UPDATE: 'projects:update',
  PROJECTS_DELETE: 'projects:delete',

  TICKETS_READ:   'tickets:read',
  TICKETS_CREATE: 'tickets:create',
  TICKETS_UPDATE: 'tickets:update',
  TICKETS_DELETE: 'tickets:delete',

  CLIENTS_READ:   'clients:read',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',

  INVOICES_READ:   'invoices:read',
  INVOICES_CREATE: 'invoices:create',
  INVOICES_UPDATE: 'invoices:update',
  INVOICES_DELETE: 'invoices:delete',

  ANALYTICS_READ:  'analytics:read',
  SETTINGS_READ:   'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  AUDIT_READ:      'audit:read',
});

export const PERMISSION_LIST = Object.values(PERMISSIONS);