import apiClient from '../../../shared/services/apiClient';

export const profileApi = {
  get:            ()       => apiClient.get('/profile'),
  update:         (data)   => apiClient.patch('/profile', data),
  changePassword: (data)   => apiClient.patch('/profile/password', data),
  updateAvatar:   (file)   => {
    const form = new FormData();
    form.append('avatar', file);
    return apiClient.patch('/profile/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};