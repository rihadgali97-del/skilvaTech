import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { ROUTES } from '../../../shared/constants/routes';

const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const { register, loading, error } = useAuth();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => { e.preventDefault(); await register(form); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-white tracking-tight">
            skilva<span className="text-violet-400">tech</span>
          </span>
          <p className="text-slate-400 mt-2 text-sm">Create your account</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-semibold text-white mb-6">Get started</h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[['firstName', 'First name'], ['lastName', 'Last name']].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
                  <input name={field} type="text" required value={form[field]} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input name="password" type="password" required value={form.password} onChange={handleChange}
                placeholder="Min. 8 characters, 1 uppercase, 1 number"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
