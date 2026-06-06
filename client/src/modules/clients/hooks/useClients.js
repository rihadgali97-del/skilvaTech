import { useState, useEffect, useCallback } from 'react';
import { clientApi } from '../api/clientApi';
import useDebounce from '../../../shared/hooks/useDebounce';

export const useClients = () => {
  const [clients, setClients]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const fetchClients = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await clientApi.list({ page, limit: 10, ...(debouncedSearch && { search: debouncedSearch }) });
      setClients(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load clients');
    } finally { setLoading(false); }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchClients(); }, [fetchClients]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const createClient = async (formData) => {
    const { data } = await clientApi.create(formData);
    await fetchClients();
    return data.data.client;
  };

  const updateClient = async (id, formData) => {
    const { data } = await clientApi.update(id, formData);
    await fetchClients();
    return data.data.client;
  };

  const deleteClient = async (id) => {
    await clientApi.delete(id);
    await fetchClients();
  };

  return {
    clients, loading, error, pagination,
    page, setPage, search, setSearch,
    createClient, updateClient, deleteClient,
    refetch: fetchClients,
  };
};