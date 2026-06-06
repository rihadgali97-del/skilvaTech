import { useState, useEffect, useCallback } from 'react';
import { leadApi } from '../api/leadApi';
import useDebounce from '../../../shared/hooks/useDebounce';

export const useLeads = () => {
  const [leads, setLeads]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await leadApi.list({
        page, limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter    && { status: statusFilter }),
      });
      setLeads(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load leads');
    } finally { setLoading(false); }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const createLead = async (formData) => { const { data } = await leadApi.create(formData);        await fetchLeads(); return data.data.lead; };
  const updateLead = async (id, formData) => { const { data } = await leadApi.update(id, formData); await fetchLeads(); return data.data.lead; };
  const deleteLead = async (id) => { await leadApi.delete(id); await fetchLeads(); };

  return {
    leads, loading, error, pagination,
    page, setPage, search, setSearch,
    statusFilter, setStatusFilter,
    createLead, updateLead, deleteLead,
    refetch: fetchLeads,
  };
};