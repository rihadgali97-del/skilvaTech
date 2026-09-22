import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../shared/services/apiClient';
import useDebounce from '../../../shared/hooks/useDebounce';

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [pagination, setPagination]   = useState({ page: 1, totalPages: 1, total: 0 });

  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const debouncedSearch         = useDebounce(search, 400);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status)          params.status = status;

      const { data } = await apiClient.get('/enrollments', { params });
      setEnrollments(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load enrollments');
    } finally { setLoading(false); }
  }, [page, debouncedSearch, status]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);
  useEffect(() => { setPage(1); }, [debouncedSearch, status]);

  // ── Admin: enroll any student in any course ─────────────────────────────────
  const enroll = async (studentId, courseId) => {
    const { data } = await apiClient.post('/enrollments', { studentId, courseId });
    await fetchEnrollments();
    return data.data.enrollment;
  };

  // ── Admin: update any enrollment's progress ─────────────────────────────────
  const updateProgress = async (id, progress) => {
    const { data } = await apiClient.patch(`/enrollments/${id}/progress`, { progress });
    await fetchEnrollments();
    return data.data.enrollment;
  };

  // ── Admin: cancel any enrollment ────────────────────────────────────────────
  const cancel = async (id) => {
    const { data } = await apiClient.patch(`/enrollments/${id}/cancel`);
    await fetchEnrollments();
    return data.data.enrollment;
  };

  return {
    enrollments, loading, error, pagination,
    page, setPage,
    search, setSearch,
    status, setStatus,
    enroll, updateProgress, cancel,
    refetch: fetchEnrollments,
  };
};