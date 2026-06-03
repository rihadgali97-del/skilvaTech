import apiClient from '../../../shared/services/apiClient';

const BASE = '/service-categories';

export const serviceCategoryApi = {
  list:     (params)   => apiClient.get(BASE, { params }),
  getById:  (id)       => apiClient.get(`${BASE}/${id}`),
  create:   (data)     => apiClient.post(BASE, data),
  update:   (id, data) => apiClient.patch(`${BASE}/${id}`, data),
  delete:   (id)       => apiClient.delete(`${BASE}/${id}`),
};