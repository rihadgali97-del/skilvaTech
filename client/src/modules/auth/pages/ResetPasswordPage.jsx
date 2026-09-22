import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../shared/services/apiClient';

const ResetPasswordPage = () => {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get('token');

  const [tokenValid, setTokenValid]     = useState(null); // null=checking, true=valid, false=invalid
  const [form, setForm]                 = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading]           = useState(false);
  const [done, setDone]                 = useState(false);
  const [error, setError]               = useState('');

  // Verify the token when the page loads
  useEffect(() => {
    if (!token) { setTokenValid(false); return; }

    apiClient.post('/auth/verify-reset-token', { token })
      .then(() => setTokenValid(true))
      .catch(() => setTokenValid(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters'); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        newPassword: form.newPassword,
      });
      setDone(true);
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#0d1f2d] flex items-center justify-center text-[#00d4d4] font-bold text-xl mx-auto mb-4">S</div>
          <h1 className="text-2xl font-bold text-gray-900">SkilVaTech</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {/* ── Checking token ── */}
          {tokenValid === null && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-[#00d4d4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Verifying your reset link...</p>
            </div>
          )}

          {/* ── Invalid token ── */}
          {tokenValid === false && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-3xl mx-auto mb-4">
                ⚠️
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Link expired or invalid</h2>
              <p className="text-gray-500 text-sm mb-6">
                This password reset link has expired or already been used. Reset links are valid for 1 hour.
              </p>
              <Link to="/forgot-password"
                className="block w-full py-3 px-4 bg-[#00d4d4] hover:bg-[#00b3b3] text-white rounded-xl text-sm font-semibold text-center transition-all">
                Request a New Link
              </Link>
            </div>
          )}

          {/* ── Success state ── */}
          {done && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl mx-auto mb-4">
                ✅
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Password reset!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your password has been updated. Redirecting you to sign in...
              </p>
              <Link to="/login"
                className="block w-full py-3 px-4 bg-[#0d1f2d] hover:bg-[#1a3347] text-white rounded-xl text-sm font-semibold text-center transition-all">
                Sign In Now
              </Link>
            </div>
          )}

          {/* ── Reset form ── */}
          {tokenValid === true && !done && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Set a new password</h2>
                <p className="text-gray-500 text-sm">Choose a strong password you haven't used before.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min 8 characters"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Repeat your new password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4] transition-all"
                  />
                </div>

                {/* Password strength hints */}
                <ul className="text-xs text-gray-400 space-y-1 pl-1">
                  <li className={form.newPassword.length >= 8 ? 'text-emerald-500' : ''}>
                    {form.newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(form.newPassword) ? 'text-emerald-500' : ''}>
                    {/[A-Z]/.test(form.newPassword) ? '✓' : '○'} One uppercase letter
                  </li>
                  <li className={/[0-9]/.test(form.newPassword) ? 'text-emerald-500' : ''}>
                    {/[0-9]/.test(form.newPassword) ? '✓' : '○'} One number
                  </li>
                </ul>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#00d4d4] hover:bg-[#00b3b3] disabled:opacity-60 disabled:cursor-not-allowed
                             text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resetting...</>
                    : 'Reset Password'
                  }
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                <Link to="/login" className="text-[#00b3b3] hover:text-[#008080] font-medium transition-colors">
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;