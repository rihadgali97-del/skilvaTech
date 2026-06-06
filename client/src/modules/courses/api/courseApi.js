import apiClient from '../../../shared/services/apiClient';

const BASE = '/courses';

export const courseApi = {
  list:          (params)         => apiClient.get(BASE, { params }),
  getById:       (id)             => apiClient.get(`${BASE}/${id}`),
  create:        (data)           => apiClient.post(BASE, data),
  update:        (id, data)       => apiClient.patch(`${BASE}/${id}`, data),
  delete:        (id)             => apiClient.delete(`${BASE}/${id}`),

  // Lessons (nested under course)
  listLessons:   (courseId)       => apiClient.get(`${BASE}/${courseId}/lessons`),
  createLesson:  (courseId, data) => apiClient.post(`${BASE}/${courseId}/lessons`, data),
  updateLesson:  (courseId, lessonId, data) => apiClient.patch(`${BASE}/${courseId}/lessons/${lessonId}`, data),
  deleteLesson:  (courseId, lessonId)       => apiClient.delete(`${BASE}/${courseId}/lessons/${lessonId}`),
};