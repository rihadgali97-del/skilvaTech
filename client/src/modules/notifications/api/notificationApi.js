import apiClient from '../../../shared/services/apiClient';

const BASE = '/notifications';

export const notificationApi = {
  list:         (params) => apiClient.get(BASE, { params }),
  markAsRead:   (id)     => apiClient.patch(`${BASE}/${id}/read`),
  markAllRead:  ()       => apiClient.patch(`${BASE}/read-all`),
  delete:       (id)     => apiClient.delete(`${BASE}/${id}`),
  clearRead:    ()       => apiClient.delete(`${BASE}/clear-read`),
};