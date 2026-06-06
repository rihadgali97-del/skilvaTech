import { useState, useEffect, useCallback } from 'react';
import { ticketApi } from '../api/ticketApi';
import useDebounce from '../../../shared/hooks/useDebounce';

export const useTickets = () => {
  const [tickets, setTickets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const fetchTickets = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await ticketApi.list({
        page, limit: 10,
        ...(debouncedSearch  && { search:   debouncedSearch }),
        ...(statusFilter     && { status:   statusFilter }),
        ...(priorityFilter   && { priority: priorityFilter }),
      });
      setTickets(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load tickets');
    } finally { setLoading(false); }
  }, [page, debouncedSearch, statusFilter, priorityFilter]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, priorityFilter]);

  const createTicket = async (d) => { const { data } = await ticketApi.create(d);        await fetchTickets(); return data.data.ticket; };
  const updateTicket = async (id, d) => { const { data } = await ticketApi.update(id, d); await fetchTickets(); return data.data.ticket; };
  const deleteTicket = async (id) => { await ticketApi.delete(id); await fetchTickets(); };

  return { tickets, loading, error, pagination, page, setPage, search, setSearch, statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, createTicket, updateTicket, deleteTicket };
};