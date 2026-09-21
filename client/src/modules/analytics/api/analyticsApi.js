import apiClient from '../../../shared/services/apiClient';

const BASE = '/analytics';

export const analyticsApi = {
  getOverview:    () => apiClient.get(`${BASE}/overview`),
  getRevenue:     () => apiClient.get(`${BASE}/revenue`),
  getLeads:       () => apiClient.get(`${BASE}/leads`),
  getTickets:     () => apiClient.get(`${BASE}/tickets`),
  getEnrollments: () => apiClient.get(`${BASE}/enrollments`),
  getClients:     () => apiClient.get(`${BASE}/clients`),
};