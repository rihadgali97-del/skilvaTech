import axios from 'axios';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchServices          = (params) => publicApi.get('/services', { params });
export const fetchServiceCategories = ()       => publicApi.get('/service-categories');
export const fetchCourses           = (params) => publicApi.get('/courses', { params });
export const fetchCourseById        = (id)     => publicApi.get(`/courses/${id}`);

export default publicApi;