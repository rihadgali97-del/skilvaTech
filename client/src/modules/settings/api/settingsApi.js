import apiClient from '../../../shared/services/apiClient';

const BASE = '/settings';

export const settingsApi = {
  getAll:       ()            => apiClient.get(BASE),
  getSystem:    ()            => apiClient.get(`${BASE}/system`),
  update:       (key, value)  => apiClient.patch(`${BASE}/${key}`, { value }),
  updateMany:   (updates)     => apiClient.patch(BASE, { updates }),
  resetGroup:   (group)       => apiClient.post(`${BASE}/reset/${group}`),
  sendTestEmail:(to)          => apiClient.post(`${BASE}/test-email`, { to }),
};