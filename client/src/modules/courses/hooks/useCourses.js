import { useState, useEffect, useCallback } from 'react';
import { courseApi } from '../api/courseApi';
import useDebounce from '../../../shared/hooks/useDebounce';

export const useCourses = () => {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const fetchCourses = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await courseApi.list({
        page, limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(levelFilter    && { level: levelFilter }),
      });
      setCourses(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load courses');
    } finally { setLoading(false); }
  }, [page, debouncedSearch, levelFilter]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { setPage(1); }, [debouncedSearch, levelFilter]);

  const createCourse = async (data) => {
    const res = await courseApi.create(data);
    await fetchCourses();
    return res.data.data.course;
  };

  const updateCourse = async (id, data) => {
    const res = await courseApi.update(id, data);
    await fetchCourses();
    return res.data.data.course;
  };

  const deleteCourse = async (id) => {
    await courseApi.delete(id);
    await fetchCourses();
  };

  return {
    courses, loading, error, pagination,
    page, setPage, search, setSearch,
    levelFilter, setLevelFilter,
    createCourse, updateCourse, deleteCourse,
    refetch: fetchCourses,
  };
};