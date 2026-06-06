import { useState, useEffect, useCallback } from 'react';
import { projectApi } from '../api/projectApi';
import useDebounce from '../../../shared/hooks/useDebounce';

export const useProjects = () => {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const fetchProjects = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await projectApi.list({
        page, limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter    && { status: statusFilter }),
      });
      setProjects(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load projects');
    } finally { setLoading(false); }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const createProject = async (d) => { const { data } = await projectApi.create(d);        await fetchProjects(); return data.data.project; };
  const updateProject = async (id, d) => { const { data } = await projectApi.update(id, d); await fetchProjects(); return data.data.project; };
  const deleteProject = async (id) => { await projectApi.delete(id); await fetchProjects(); };

  return { projects, loading, error, pagination, page, setPage, search, setSearch, statusFilter, setStatusFilter, createProject, updateProject, deleteProject };
};