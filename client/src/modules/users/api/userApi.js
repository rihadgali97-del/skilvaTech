import apiClient from '../../../shared/services/apiClient';

const BASE = '/users';

export const userApi = {
  list:         (params) => apiClient.get(BASE, { params }),
  getById:      (id)     => apiClient.get(`${BASE}/${id}`),
  create:       (data)   => apiClient.post(BASE, data),
  update:       (id, data) => apiClient.patch(`${BASE}/${id}`, data),
  updateRole:   (id, roleId) => apiClient.patch(`${BASE}/${id}/role`, { roleId }),
  activate:     (id)     => apiClient.patch(`${BASE}/${id}/activate`),
  deactivate:   (id)     => apiClient.patch(`${BASE}/${id}/deactivate`),
  delete:       (id)     => apiClient.delete(`${BASE}/${id}`),
};