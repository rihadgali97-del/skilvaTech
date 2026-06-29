import { useState, useEffect } from 'react';
import { fetchServices, fetchServiceCategories, fetchCourses } from '../api/publicApi';

// ─── Generic fetch hook ───────────────────────────────────────────────────────
export const useFetch = (fetcher, params = {}) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher(params)
      .then(({ data: res }) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [JSON.stringify(params)]);

  return { data, loading, error };
};

// ─── Specific hooks ───────────────────────────────────────────────────────────
export const usePublicServices = (params = {}) => {
  const { data, loading, error } = useFetch(fetchServices, { isActive: 'true', ...params });
  return { services: data?.data || [], loading, error };
};

export const usePublicCategories = () => {
  const { data, loading, error } = useFetch(fetchServiceCategories);
  return { categories: data?.data?.categories || [], loading, error };
};

export const usePublicCourses = (params = {}) => {
  const { data, loading, error } = useFetch(fetchCourses, { isPublished: 'true', ...params });
  return {
    courses:    data?.data || [],
    pagination: data?.pagination || {},
    loading,
    error,
  };
};