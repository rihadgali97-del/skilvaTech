import apiClient from '../../../shared/services/apiClient';

const BASE = '/invoices';

export const invoiceApi = {
  list:       (params)   => apiClient.get(BASE, { params }),
  getById:    (id)       => apiClient.get(`${BASE}/${id}`),
  getStats:   ()         => apiClient.get(`${BASE}/stats`),
  create:     (data)     => apiClient.post(BASE, data),
  update:     (id, data) => apiClient.patch(`${BASE}/${id}`, data),
  send:       (id)       => apiClient.post(`${BASE}/${id}/send`),
  markPaid:   (id)       => apiClient.post(`${BASE}/${id}/paid`),
  cancel:     (id)       => apiClient.post(`${BASE}/${id}/cancel`),
  delete:     (id)       => apiClient.delete(`${BASE}/${id}`),
  downloadPDF:(id)       => apiClient.get(`${BASE}/${id}/pdf`, { responseType: 'blob' }),
};