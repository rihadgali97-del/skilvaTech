import apiClient from '../../../shared/services/apiClient';

const BASE = '/roles';

export const roleApi = {
  list:              ()              => apiClient.get(BASE),
  getById:           (id)            => apiClient.get(`${BASE}/${id}`),
  create:            (data)          => apiClient.post(BASE, data),
  update:            (id, data)      => apiClient.patch(`${BASE}/${id}`, data),
  delete:            (id)            => apiClient.delete(`${BASE}/${id}`),
  assignPermissions: (id, permissionIds) => apiClient.put(`${BASE}/${id}/permissions`, { permissionIds }),
};