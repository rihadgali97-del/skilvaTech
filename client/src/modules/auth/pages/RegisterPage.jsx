import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { ROUTES } from '../../../shared/constants/routes';

const RegisterPage = () => {
  // Added confirmPassword to initial state
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');
  const { register, loading, error } = useAuth();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setLocalError('');

    // Quick frontend check before sending a network request
    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    await register(form); 
  };

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

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Get started</h2>
          <p className="text-gray-500 text-sm mb-8">Create your account to continue</p>

          {(error || localError) && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['firstName', 'First name'],
                ['lastName', 'Last name'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input
                    name={field}
                    type="text"
                    required
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/40
                               focus:border-[#00d4d4] transition-all shadow-sm"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/40
                           focus:border-[#00d4d4] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/40
                           focus:border-[#00d4d4] transition-all shadow-sm"
              />
            </div>

            {/* New Confirm Password Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/40
                           focus:border-[#00d4d4] transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#00d4d4] hover:bg-[#00b3b3] text-white font-semibold
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-[#00b3b3] hover:text-[#008080] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;