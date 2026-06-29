import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useAuthStore } from '../../../store/authStore';

// ─── Reusable setting components ─────────────────────────────────────────────

const Toggle = ({ value, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!value)}
    disabled={disabled}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0
      ${value ? 'bg-[#00d4d4]' : 'bg-gray-200'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
      ${value ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

const SettingRow = ({ label, description, children, danger = false }) => (
  <div className={`flex items-center justify-between py-4 border-b border-gray-100 last:border-0
    ${danger ? 'bg-red-50/50 -mx-6 px-6 rounded-xl' : ''}`}>
    <div className="flex-1 pr-8">
      <p className={`text-sm font-medium ${danger ? 'text-red-700' : 'text-gray-900'}`}>{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const SectionCard = ({ title, description, icon, children, onReset, group, saving }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </div>
      {onReset && (
        <button onClick={() => onReset(group)}
          className="text-xs text-gray-400 hover:text-[#00b3b3] transition-colors font-medium">
          Reset to defaults
        </button>
      )}
    </div>
    <div className="px-6 py-2">{children}</div>
  </div>
);

const TextInput = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value ?? ''}
    onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
    placeholder={placeholder}
    className="w-48 px-3 py-2 rounded-xl border border-gray-300 text-sm text-gray-900
               focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4] transition-all"
  />
);

const SelectInput = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-48 px-3 py-2 pr-8 rounded-xl border border-gray-300 text-sm text-gray-900
                 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4]
                 appearance-none transition-all bg-white"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <svg className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

const StatusBadge = ({ ok, label }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
    ${ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
    {label}
  </span>
);

// ─── Sidebar navigation ────────────────────────────────────────────────────────
const TABS = [
  { id: 'general',       label: 'General',        icon: '⚙️' },
  { id: 'security',      label: 'Security',       icon: '🔒' },
  { id: 'email',         label: 'Email',          icon: '📧' },
  { id: 'notifications', label: 'Notifications',  icon: '🔔' },
  { id: 'appearance',    label: 'Appearance',     icon: '🎨' },
  { id: 'users',         label: 'Users & Access', icon: '👥' },
  { id: 'storage',       label: 'Storage',        icon: '📁' },
  { id: 'system',        label: 'System',         icon: '🖥️' },
];

// ─── Settings Page ─────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const { settings, system, loading, saving, error, success, updateSetting, resetGroup, sendTestEmail, getValue } = useSettings();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const [testEmailAddress, setTestEmailAddress] = useState(user?.email || '');
  const [localValues, setLocalValues] = useState({});

  const get = (key) => localValues[key] !== undefined ? localValues[key] : getValue(key);

  const set = (key, value) => {
    setLocalValues((p) => ({ ...p, [key]: value }));
    updateSetting(key, value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#00d4d4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all platform settings and configurations</p>
      </div>

      {/* Toast notifications */}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <span>✓</span> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
          <span>✕</span> {error}
        </div>
      )}

      <div className="flex gap-6">

        {/* Sidebar */}
        <div className="w-52 flex-shrink-0">
          <nav className="bg-white border border-gray-200 rounded-2xl shadow-sm p-2 sticky top-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5
                  ${activeTab === tab.id
                    ? 'bg-[#00d4d4]/10 text-[#008080] border border-[#00d4d4]/20'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">

          {/* ── GENERAL ──────────────────────────────────────────────────────── */}
          {activeTab === 'general' && (
            <SectionCard title="General" icon="⚙️" description="Core platform configuration" onReset={resetGroup} group="general" saving={saving}>
              <SettingRow label="Platform Name" description="Shown in the navbar and emails">
                <TextInput value={get('general.platform_name')} onChange={(v) => set('general.platform_name', v)} placeholder="SkilVaTech" />
              </SettingRow>
              <SettingRow label="Platform URL" description="Used in email links and redirects">
                <TextInput value={get('general.platform_url')} onChange={(v) => set('general.platform_url', v)} placeholder="https://..." />
              </SettingRow>
              <SettingRow label="Default Language" description="Platform interface language">
                <SelectInput value={get('general.language')} onChange={(v) => set('general.language', v)}
                  options={[{ value: 'en', label: 'English' }, { value: 'fr', label: 'French' }, { value: 'es', label: 'Spanish' }, { value: 'ar', label: 'Arabic' }]}
                />
              </SettingRow>
              <SettingRow label="Timezone" description="Default timezone for displaying dates">
                <SelectInput value={get('general.timezone')} onChange={(v) => set('general.timezone', v)}
                  options={[{ value: 'UTC', label: 'UTC' }, { value: 'America/New_York', label: 'Eastern' }, { value: 'America/Los_Angeles', label: 'Pacific' }, { value: 'Europe/London', label: 'London' }, { value: 'Africa/Nairobi', label: 'Nairobi' }]}
                />
              </SettingRow>
              <SettingRow label="Allow Self-Registration" description="Allow users to create accounts on the public site">
                <Toggle value={!!get('general.allow_registration')} onChange={(v) => set('general.allow_registration', v)} />
              </SettingRow>
              <SettingRow label="Maintenance Mode" description="Blocks all non-admin access to the platform" danger>
                <Toggle value={!!get('general.maintenance_mode')} onChange={(v) => set('general.maintenance_mode', v)} />
              </SettingRow>
            </SectionCard>
          )}

          {/* ── SECURITY ─────────────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <SectionCard title="Security" icon="🔒" description="Authentication and access control policies" onReset={resetGroup} group="security" saving={saving}>
              <SettingRow label="Minimum Password Length" description="Minimum characters required for all passwords">
                <TextInput type="number" value={get('security.min_password_length')} onChange={(v) => set('security.min_password_length', v)} />
              </SettingRow>
              <SettingRow label="Require Uppercase Letter" description="Passwords must contain at least one uppercase letter">
                <Toggle value={!!get('security.require_uppercase')} onChange={(v) => set('security.require_uppercase', v)} />
              </SettingRow>
              <SettingRow label="Require Number" description="Passwords must contain at least one number">
                <Toggle value={!!get('security.require_number')} onChange={(v) => set('security.require_number', v)} />
              </SettingRow>
              <SettingRow label="Require Special Character" description="Passwords must contain !, @, #, $, etc.">
                <Toggle value={!!get('security.require_special_char')} onChange={(v) => set('security.require_special_char', v)} />
              </SettingRow>
              <SettingRow label="Max Login Attempts" description="Account locks after this many consecutive failed logins">
                <TextInput type="number" value={get('security.max_login_attempts')} onChange={(v) => set('security.max_login_attempts', v)} />
              </SettingRow>
              <SettingRow label="Session Timeout (hours)" description="Users are logged out after this period of inactivity">
                <TextInput type="number" value={get('security.session_timeout_hours')} onChange={(v) => set('security.session_timeout_hours', v)} />
              </SettingRow>
              <SettingRow label="Require Email Verification" description="New users must verify their email before logging in">
                <Toggle value={!!get('security.require_email_verification')} onChange={(v) => set('security.require_email_verification', v)} />
              </SettingRow>
              <SettingRow label="Enforce 2FA" description="Require two-factor auth for all users (coming soon)" >
                <Toggle value={!!get('security.enforce_2fa')} onChange={(v) => set('security.enforce_2fa', v)} disabled />
              </SettingRow>
            </SectionCard>
          )}

          {/* ── EMAIL ────────────────────────────────────────────────────────── */}
          {activeTab === 'email' && (
            <>
              <SectionCard title="Email" icon="📧" description="Configure outgoing email settings" onReset={resetGroup} group="email" saving={saving}>
                <SettingRow label="Email Sending Enabled" description="Master switch — disabling this stops all outgoing emails">
                  <Toggle value={!!get('email.enabled')} onChange={(v) => set('email.enabled', v)} />
                </SettingRow>
                <SettingRow label="From Name" description="The name shown in the email 'From' field">
                  <TextInput value={get('email.from_name')} onChange={(v) => set('email.from_name', v)} placeholder="SkilVaTech" />
                </SettingRow>
                <SettingRow label="From Address" description="The email address used to send emails">
                  <TextInput type="email" value={get('email.from_address')} onChange={(v) => set('email.from_address', v)} placeholder="noreply@..." />
                </SettingRow>
                <SettingRow label="Send Welcome Email" description="Send a welcome email when a new user registers">
                  <Toggle value={!!get('email.welcome_email')} onChange={(v) => set('email.welcome_email', v)} />
                </SettingRow>
                <SettingRow label="Password Reset Email" description="Allow users to reset their password via email">
                  <Toggle value={!!get('email.password_reset')} onChange={(v) => set('email.password_reset', v)} />
                </SettingRow>
                <SettingRow label="Ticket Notification Email" description="Email assigned user when a new ticket is created">
                  <Toggle value={!!get('email.ticket_notification')} onChange={(v) => set('email.ticket_notification', v)} />
                </SettingRow>
              </SectionCard>

              {/* Test email */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Send Test Email</h3>
                <p className="text-gray-500 text-sm mb-4">Verify your SMTP configuration is working correctly.</p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="test@example.com"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4]"
                  />
                  <button onClick={() => sendTestEmail(testEmailAddress)}
                    className="px-5 py-2.5 bg-[#00d4d4] hover:bg-[#00b3b3] text-white rounded-xl text-sm font-semibold transition-all">
                    Send Test
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── NOTIFICATIONS ────────────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <SectionCard title="Notifications" icon="🔔" description="Control which events trigger in-app notifications" onReset={resetGroup} group="notifications" saving={saving}>
              <SettingRow label="New User Registered" description="Notify admins when someone creates an account">
                <Toggle value={!!get('notifications.new_user')} onChange={(v) => set('notifications.new_user', v)} />
              </SettingRow>
              <SettingRow label="New Client Added" description="Notify when a new client is created in CRM">
                <Toggle value={!!get('notifications.new_client')} onChange={(v) => set('notifications.new_client', v)} />
              </SettingRow>
              <SettingRow label="New Ticket Opened" description="Notify assigned user when a support ticket is created">
                <Toggle value={!!get('notifications.new_ticket')} onChange={(v) => set('notifications.new_ticket', v)} />
              </SettingRow>
              <SettingRow label="New Enrollment" description="Notify course instructor when a student enrolls">
                <Toggle value={!!get('notifications.new_enrollment')} onChange={(v) => set('notifications.new_enrollment', v)} />
              </SettingRow>
              <SettingRow label="Ticket Resolved" description="Notify the ticket creator when their ticket is resolved">
                <Toggle value={!!get('notifications.ticket_resolved')} onChange={(v) => set('notifications.ticket_resolved', v)} />
              </SettingRow>
            </SectionCard>
          )}

          {/* ── APPEARANCE ───────────────────────────────────────────────────── */}
          {activeTab === 'appearance' && (
            <SectionCard title="Appearance" icon="🎨" description="Customize the look and feel of the platform" onReset={resetGroup} group="appearance" saving={saving}>
              <SettingRow label="Brand Color" description="Primary color used for buttons, active nav, and accents">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={get('appearance.brand_color') || '#00d4d4'}
                    onChange={(e) => set('appearance.brand_color', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-gray-300 cursor-pointer p-1"
                  />
                  <span className="text-sm text-gray-600 font-mono">{get('appearance.brand_color') || '#00d4d4'}</span>
                </div>
              </SettingRow>
              <SettingRow label="Sidebar Theme" description="Light or dark sidebar background">
                <SelectInput value={get('appearance.sidebar_theme')} onChange={(v) => set('appearance.sidebar_theme', v)}
                  options={[{ value: 'dark', label: 'Dark (Navy)' }, { value: 'light', label: 'Light (White)' }]}
                />
              </SettingRow>
              <SettingRow label="Show 'Powered by SkilVaTech'" description="Display branding in the platform footer">
                <Toggle value={!!get('appearance.show_powered_by')} onChange={(v) => set('appearance.show_powered_by', v)} />
              </SettingRow>
            </SectionCard>
          )}

          {/* ── USERS & ACCESS ───────────────────────────────────────────────── */}
          {activeTab === 'users' && (
            <SectionCard title="Users & Access" icon="👥" description="User management and access control defaults" onReset={resetGroup} group="users" saving={saving}>
              <SettingRow label="Default Role" description="Role automatically assigned to new self-registered users">
                <SelectInput value={get('users.default_role')} onChange={(v) => set('users.default_role', v)}
                  options={[{ value: 'student', label: 'Student' }, { value: 'client', label: 'Client' }, { value: 'instructor', label: 'Instructor' }]}
                />
              </SettingRow>
              <SettingRow label="Allow Profile Editing" description="Users can edit their own first name, last name, and phone">
                <Toggle value={!!get('users.allow_profile_edit')} onChange={(v) => set('users.allow_profile_edit', v)} />
              </SettingRow>
              <SettingRow label="Allow Avatar Upload" description="Users can upload a custom profile picture">
                <Toggle value={!!get('users.allow_avatar_upload')} onChange={(v) => set('users.allow_avatar_upload', v)} />
              </SettingRow>
            </SectionCard>
          )}

          {/* ── STORAGE ──────────────────────────────────────────────────────── */}
          {activeTab === 'storage' && (
            <SectionCard title="Storage" icon="📁" description="File upload limits and allowed types" onReset={resetGroup} group="storage" saving={saving}>
              <SettingRow label="Max Upload Size (MB)" description="Maximum file size allowed for all uploads">
                <TextInput type="number" value={get('storage.max_upload_mb')} onChange={(v) => set('storage.max_upload_mb', v)} />
              </SettingRow>
              <SettingRow label="Allowed Image Types" description="Comma-separated list of allowed image extensions">
                <TextInput value={get('storage.allowed_image_types')} onChange={(v) => set('storage.allowed_image_types', v)} placeholder="jpg,png,webp" />
              </SettingRow>
              <SettingRow label="Allowed Document Types" description="Comma-separated list of allowed document extensions">
                <TextInput value={get('storage.allowed_doc_types')} onChange={(v) => set('storage.allowed_doc_types', v)} placeholder="pdf,doc,docx" />
              </SettingRow>
              <SettingRow label="Cloudinary Status" description="File upload provider connection status">
                <StatusBadge ok={!!import.meta.env.VITE_CLOUDINARY_NAME} label={import.meta.env.VITE_CLOUDINARY_NAME ? 'Connected' : 'Not configured'} />
              </SettingRow>
            </SectionCard>
          )}

          {/* ── SYSTEM ───────────────────────────────────────────────────────── */}
          {activeTab === 'system' && system && (
            <>
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                  <span className="text-xl">🖥️</span>
                  <h3 className="font-semibold text-gray-900">System Information</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Version',      value: system.version },
                    { label: 'Node.js',      value: system.nodeVersion },
                    { label: 'Environment',  value: system.environment },
                    { label: 'Uptime',       value: `${Math.floor(system.uptime / 3600)}h ${Math.floor((system.uptime % 3600) / 60)}m` },
                    { label: 'Memory Usage', value: `${system.memoryMB} MB` },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900 font-mono">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <h3 className="font-semibold text-gray-900">Database Statistics</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {Object.entries(system.database).map(([key, count]) => (
                    <div key={key} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                      <span className="text-sm text-gray-600 capitalize">{key}</span>
                      <span className="text-lg font-bold text-[#00b3b3]">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                  <span className="text-xl">⚡</span>
                  <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { label: 'Clear settings cache',   desc: 'Force re-fetch all settings from database',  action: () => window.location.reload(), color: 'blue' },
                    { label: 'View audit logs',        desc: 'See all system activity and user actions',    action: () => window.location.href = '/dashboard/audit-logs', color: 'teal' },
                    { label: 'Health check',           desc: 'Test database and Redis connectivity',         action: () => window.open('/api/health', '_blank'), color: 'green' },
                  ].map((action) => (
                    <div key={action.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{action.label}</p>
                        <p className="text-xs text-gray-500">{action.desc}</p>
                      </div>
                      <button onClick={action.action}
                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-[#00d4d4]/10 hover:text-[#00b3b3]
                                   text-gray-600 text-sm font-medium transition-all border border-transparent
                                   hover:border-[#00d4d4]/20">
                        Run →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;