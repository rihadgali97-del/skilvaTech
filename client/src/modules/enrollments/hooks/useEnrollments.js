import { useState, useEffect, useCallback } from 'react';
import { enrollmentApi } from '../api/enrollmentApi';

export const useEnrollments = (filters = {}) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [pagination, setPagination]   = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]               = useState(1);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await enrollmentApi.list({ page, limit: 10, ...filters });
      setEnrollments(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load enrollments');
    } finally { setLoading(false); }
  }, [page, JSON.stringify(filters)]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  const enroll = async (studentId, courseId) => {
    const res = await enrollmentApi.enroll({ studentId, courseId });
    await fetchEnrollments();
    return res.data.data.enrollment;
  };

  const updateProgress = async (id, progress) => {
    const res = await enrollmentApi.updateProgress(id, { progress });
    await fetchEnrollments();
    return res.data.data.enrollment;
  };

  const cancel = async (id) => {
    await enrollmentApi.cancel(id);
    await fetchEnrollments();
  };

  return {
    enrollments, loading, error, pagination,
    page, setPage,
    enroll, updateProgress, cancel,
    refetch: fetchEnrollments,
  };
};