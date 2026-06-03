import apiClient from '../../../shared/services/apiClient';

const BASE = '/auth';

export const authApi = {
  register:       (data)  => apiClient.post(`${BASE}/register`, data),
  login:          (data)  => apiClient.post(`${BASE}/login`, data),
  logout:         ()      => apiClient.post(`${BASE}/logout`),
  refresh:        (token) => apiClient.post(`${BASE}/refresh`, { refreshToken: token }),
  getMe:          ()      => apiClient.get(`${BASE}/me`),
  changePassword: (data)  => apiClient.post(`${BASE}/change-password`, data),
  forgotPassword: (email) => apiClient.post(`${BASE}/forgot-password`, { email }),
  resetPassword:  (data)  => apiClient.post(`${BASE}/reset-password`, data),
};
