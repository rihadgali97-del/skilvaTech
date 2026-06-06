import apiClient from '../../../shared/services/apiClient';

const BASE = '/enrollments';

export const enrollmentApi = {
  list:           (params) => apiClient.get(BASE, { params }),
  enroll:         (data)   => apiClient.post(BASE, data),
  updateProgress: (id, data) => apiClient.patch(`${BASE}/${id}/progress`, data),
  cancel:         (id)     => apiClient.patch(`${BASE}/${id}/cancel`),
};