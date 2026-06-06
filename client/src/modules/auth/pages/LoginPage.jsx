import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { ROUTES } from '../../../shared/constants/routes';

const LoginPage = () => {
  const [form, setForm]                 = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error }       = useAuth();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => { e.preventDefault(); await login(form); };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0d1f2d] flex-col items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#00d4d4]/20 border border-[#00d4d4]/30 mb-6">
            <span className="text-4xl font-bold text-[#00d4d4]">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Skilva<span className="text-[#00d4d4]">Tech</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Your all-in-one platform for managing courses, clients, services and projects.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-2xl font-bold text-gray-900">
              Skilva<span className="text-[#00d4d4]">Tech</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/40
                           focus:border-[#00d4d4] transition-all shadow-sm" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-[#00b3b3] hover:text-[#008080] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} required
                  value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full px-4 py-3 pr-16 rounded-xl bg-white border border-gray-300 text-gray-900
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/40
                             focus:border-[#00d4d4] transition-all shadow-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-[#00d4d4] hover:bg-[#00b3b3] text-white font-semibold
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-[#00b3b3] hover:text-[#008080] font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;