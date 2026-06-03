import { useState, useEffect, useCallback } from 'react';
import { serviceApi } from '../api/serviceApi';
import useDebounce from '../../../shared/hooks/useDebounce';

export const useServices = () => {
  const [services, setServices]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const fetchServices = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await serviceApi.list({
        page, limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(categoryFilter  && { categoryId: categoryFilter }),
      });
      setServices(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load services');
    } finally { setLoading(false); }
  }, [page, debouncedSearch, categoryFilter]);

  useEffect(() => { fetchServices(); }, [fetchServices]);
  useEffect(() => { setPage(1); }, [debouncedSearch, categoryFilter]);

  const createService = async (formData) => { const { data } = await serviceApi.create(formData);        await fetchServices(); return data.data.service; };
  const updateService = async (id, formData) => { const { data } = await serviceApi.update(id, formData); await fetchServices(); return data.data.service; };
  const deleteService = async (id) => { await serviceApi.delete(id); await fetchServices(); };

  return {
    services, loading, error, pagination,
    page, setPage, search, setSearch,
    categoryFilter, setCategoryFilter,
    createService, updateService, deleteService,
    refetch: fetchServices,
  };
};