import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../modules/auth/api/authApi';
import { ROUTES } from '../constants/routes';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();
  const { setAuth, logout: storeLogout, user, isAuthenticated, hasPermission, hasRole } = useAuthStore();

  const login = async (credentials) => {
    setLoading(true); setError(null);
    try {
      const { data } = await authApi.login(credentials);
      const { user, tokens } = data.data;
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      navigate(ROUTES.DASHBOARD);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally { setLoading(false); }
  };

  const register = async (formData) => {
    setLoading(true); setError(null);
    try {
      const { data } = await authApi.register(formData);
      const { user, tokens } = data.data;
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      navigate(ROUTES.DASHBOARD);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally { setLoading(false); }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch (_) {}
    finally { storeLogout(); navigate(ROUTES.LOGIN); }
  };

  return { user, isAuthenticated, loading, error, login, register, logout, hasPermission, hasRole };
};
