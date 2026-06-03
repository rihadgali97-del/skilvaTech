import apiClient from '../../../shared/services/apiClient';

export const permissionApi = {
  list: () => apiClient.get('/permissions'),
};