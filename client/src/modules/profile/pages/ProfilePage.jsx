import { useState, useEffect, useRef } from 'react';
import { profileApi } from '../api/profileApi';
import { useAuthStore } from '../../../store/authStore';
import { Button, FormField, Input } from '../../../shared/components/ui/index';

const ProfilePage = () => {
  const { user: authUser, setUser } = useAuthStore();

  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');

  // Profile form
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });

  // Password form
  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError]   = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Avatar
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    profileApi.get()
      .then(({ data }) => {
        setProfile(data.data.user);
        setForm({
          firstName: data.data.user.firstName || '',
          lastName:  data.data.user.lastName  || '',
          phone:     data.data.user.phone     || '',
        });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const showSuccess = (msg, setter) => {
    setter(msg);
    setTimeout(() => setter(''), 3000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const { data } = await profileApi.update(form);
      setProfile(data.data.user);
      if (setUser) setUser({ ...authUser, ...data.data.user });
      showSuccess('Profile updated successfully', setSuccess);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const { data } = await profileApi.updateAvatar(file);
      setProfile((p) => ({ ...p, avatar: data.data.user.avatar }));
      showSuccess('Avatar updated', setSuccess);
    } catch (err) {
      setError('Failed to upload avatar — check Cloudinary config');
    } finally { setAvatarUploading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match'); return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters'); return;
    }
    setPwSaving(true);
    try {
      await profileApi.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSuccess('Password changed successfully', setPwSuccess);
    } catch (err) {
      setPwError(err.response?.data?.error?.message || 'Failed to change password');
    } finally { setPwSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#00d4d4] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const initials = `${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and account security</p>
      </div>

      {/* Global success/error */}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <span>✓</span> {success}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
          <span>✕</span> {error}
        </div>
      )}

      {/* ── Avatar + basic info ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
        </div>
        <div className="p-6">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
            <div className="relative flex-shrink-0">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#00d4d4] flex items-center justify-center text-white text-2xl font-bold border-2 border-[#00b3b3]">
                  {initials}
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{profile?.firstName} {profile?.lastName}</p>
              <p className="text-sm text-gray-500 capitalize mb-3">{profile?.role?.name}</p>
              <div className="flex gap-2">
                <button onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#00d4d4] hover:bg-[#00b3b3] text-white text-sm font-medium transition-all">
                  {avatarUploading ? 'Uploading...' : 'Change Photo'}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WebP. Max 5MB.</p>
            </div>
          </div>

          {/* Profile form */}
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name" required>
                <Input value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  placeholder="John" />
              </FormField>
              <FormField label="Last Name" required>
                <Input value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  placeholder="Doe" />
              </FormField>
            </div>

            <FormField label="Email Address">
              <Input value={profile?.email || ''} disabled
                className="bg-gray-50 text-gray-400 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact an admin.</p>
            </FormField>

            <FormField label="Phone Number">
              <Input value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+1 555 000 0000" />
            </FormField>

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <Button type="submit" loading={saving}>Save Changes</Button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Account info ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Account Details</h3>
        </div>
        <div className="px-6 py-4 space-y-0">
          {[
            { label: 'Role',              value: profile?.role?.name,       badge: true },
            { label: 'Account Status',    value: profile?.isActive ? 'Active' : 'Inactive' },
            { label: 'Email Verified',    value: profile?.isEmailVerified ? 'Yes' : 'No' },
            { label: 'Last Login',        value: profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : 'N/A' },
            { label: 'Member Since',      value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">{item.label}</span>
              {item.badge ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#00d4d4]/10 text-[#008080] border border-[#00d4d4]/20 capitalize">
                  {item.value}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-900 capitalize">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Change password ──────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Change Password</h3>
        </div>
        <div className="p-6">
          {pwSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
              <span>✓</span> {pwSuccess}
            </div>
          )}
          {pwError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {pwError}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <FormField label="Current Password" required>
              <Input type="password" value={pwForm.currentPassword}
                onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="Enter current password" />
            </FormField>
            <FormField label="New Password" required>
              <Input type="password" value={pwForm.newPassword}
                onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="Min 8 characters" />
            </FormField>
            <FormField label="Confirm New Password" required>
              <Input type="password" value={pwForm.confirmPassword}
                onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat new password" />
            </FormField>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <Button type="submit" loading={pwSaving}>Change Password</Button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;