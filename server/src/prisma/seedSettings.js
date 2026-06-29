// Add this to your existing seed.js or run separately as:
// node src/prisma/seedSettings.js

import prisma from '../config/db.js';

const DEFAULT_SETTINGS = [
  // ── General ──────────────────────────────────────────────────────────────────
  { key: 'general.platform_name',    value: 'SkilVaTech',   group: 'general', type: 'string',  label: 'Platform Name',       description: 'Displayed in the navbar and emails', isPublic: true },
  { key: 'general.platform_url',     value: 'http://localhost:5173', group: 'general', type: 'string', label: 'Platform URL', description: 'Used in email links', isPublic: true },
  { key: 'general.timezone',         value: 'UTC',           group: 'general', type: 'string',  label: 'Timezone',            description: 'Default timezone for dates' },
  { key: 'general.language',         value: 'en',            group: 'general', type: 'string',  label: 'Default Language',    description: 'Platform default language', isPublic: true },
  { key: 'general.maintenance_mode', value: false,           group: 'general', type: 'boolean', label: 'Maintenance Mode',    description: 'Blocks all non-admin access when enabled' },
  { key: 'general.allow_registration', value: true,          group: 'general', type: 'boolean', label: 'Allow Registration',  description: 'Allow new users to self-register', isPublic: true },

  // ── Security ─────────────────────────────────────────────────────────────────
  { key: 'security.min_password_length',    value: 8,    group: 'security', type: 'number',  label: 'Minimum Password Length',   description: 'Minimum characters required for passwords' },
  { key: 'security.require_uppercase',      value: true, group: 'security', type: 'boolean', label: 'Require Uppercase',         description: 'Password must contain at least one uppercase letter' },
  { key: 'security.require_number',         value: true, group: 'security', type: 'boolean', label: 'Require Number',            description: 'Password must contain at least one number' },
  { key: 'security.require_special_char',   value: false,group: 'security', type: 'boolean', label: 'Require Special Character', description: 'Password must contain a special character' },
  { key: 'security.max_login_attempts',     value: 5,    group: 'security', type: 'number',  label: 'Max Login Attempts',        description: 'Locks account after this many failed attempts' },
  { key: 'security.session_timeout_hours',  value: 24,   group: 'security', type: 'number',  label: 'Session Timeout (hours)',   description: 'How long before refresh token expires' },
  { key: 'security.require_email_verification', value: false, group: 'security', type: 'boolean', label: 'Require Email Verification', description: 'Users must verify email before logging in' },
  { key: 'security.enforce_2fa',            value: false,group: 'security', type: 'boolean', label: 'Enforce 2FA (coming soon)', description: 'Require two-factor authentication for all users' },

  // ── Email ─────────────────────────────────────────────────────────────────────
  { key: 'email.enabled',             value: false,                    group: 'email', type: 'boolean', label: 'Email Sending Enabled', description: 'Master switch for all outgoing emails' },
  { key: 'email.from_name',           value: 'SkilVaTech',             group: 'email', type: 'string',  label: 'From Name',            description: 'Name shown in email "From" field' },
  { key: 'email.from_address',        value: 'noreply@skilvatech.com', group: 'email', type: 'string',  label: 'From Address',         description: 'Email address used to send emails' },
  { key: 'email.welcome_email',       value: true,                     group: 'email', type: 'boolean', label: 'Send Welcome Email',   description: 'Send welcome email on new user registration' },
  { key: 'email.password_reset',      value: true,                     group: 'email', type: 'boolean', label: 'Password Reset Email', description: 'Allow password reset via email' },
  { key: 'email.ticket_notification', value: true,                     group: 'email', type: 'boolean', label: 'Ticket Notifications', description: 'Email assigned user when a ticket is created' },

  // ── Notifications ─────────────────────────────────────────────────────────────
  { key: 'notifications.new_user',       value: true, group: 'notifications', type: 'boolean', label: 'New User Registered',    description: 'Notify admins when a new user registers' },
  { key: 'notifications.new_client',     value: true, group: 'notifications', type: 'boolean', label: 'New Client Added',       description: 'Notify when a new client is created' },
  { key: 'notifications.new_ticket',     value: true, group: 'notifications', type: 'boolean', label: 'New Ticket Opened',      description: 'Notify assigned user when a ticket is created' },
  { key: 'notifications.new_enrollment', value: true, group: 'notifications', type: 'boolean', label: 'New Enrollment',         description: 'Notify instructor when someone enrolls' },
  { key: 'notifications.ticket_resolved',value: true, group: 'notifications', type: 'boolean', label: 'Ticket Resolved',        description: 'Notify ticket creator when resolved' },

  // ── Appearance ────────────────────────────────────────────────────────────────
  { key: 'appearance.brand_color',       value: '#00d4d4', group: 'appearance', type: 'string',  label: 'Brand Color',        description: 'Primary brand color (hex)', isPublic: true },
  { key: 'appearance.sidebar_theme',     value: 'dark',    group: 'appearance', type: 'string',  label: 'Sidebar Theme',      description: 'dark or light sidebar', isPublic: true },
  { key: 'appearance.show_powered_by',   value: true,      group: 'appearance', type: 'boolean', label: 'Show "Powered by"',  description: 'Show SkilVaTech branding in footer', isPublic: true },

  // ── Users & Access ────────────────────────────────────────────────────────────
  { key: 'users.default_role',           value: 'student', group: 'users', type: 'string',  label: 'Default Role',           description: 'Role assigned to new registrations' },
  { key: 'users.allow_profile_edit',     value: true,      group: 'users', type: 'boolean', label: 'Allow Profile Editing',  description: 'Allow users to edit their own profile' },
  { key: 'users.allow_avatar_upload',    value: true,      group: 'users', type: 'boolean', label: 'Allow Avatar Upload',    description: 'Allow users to upload a profile picture' },

  // ── Storage ───────────────────────────────────────────────────────────────────
  { key: 'storage.max_upload_mb',        value: 10,    group: 'storage', type: 'number',  label: 'Max Upload Size (MB)',   description: 'Maximum file size for uploads' },
  { key: 'storage.allowed_image_types',  value: 'jpg,png,webp,gif', group: 'storage', type: 'string', label: 'Allowed Image Types', description: 'Comma-separated list of allowed image extensions' },
  { key: 'storage.allowed_doc_types',    value: 'pdf,doc,docx',    group: 'storage', type: 'string', label: 'Allowed Doc Types',   description: 'Comma-separated list of allowed document extensions' },
];

export const seedSettings = async () => {
  console.log('Seeding default settings...');
  for (const setting of DEFAULT_SETTINGS) {
    await prisma.setting.upsert({
      where:  { key: setting.key },
      update: {},  // Don't overwrite existing values
      create: setting,
    });
  }
  console.log(`✅ ${DEFAULT_SETTINGS.length} settings seeded`);
};

// Run directly
seedSettings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());