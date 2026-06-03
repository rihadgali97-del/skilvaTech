// ─── System roles ─────────────────────────────────────────────────────────────
export const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  ADMIN:       'admin',
  MANAGER:     'manager',
  INSTRUCTOR:  'instructor',
  STUDENT:     'student',
  CLIENT:      'client',
  STAFF:       'staff',
});

export const ROLE_LIST = Object.values(ROLES);