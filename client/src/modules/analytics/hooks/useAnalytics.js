import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../api/analyticsApi';

export const useAnalytics = () => {
  const [overview,    setOverview]    = useState(null);
  const [revenue,     setRevenue]     = useState([]);
  const [leads,       setLeads]       = useState(null);
  const [tickets,     setTickets]     = useState(null);
  const [enrollments, setEnrollments] = useState(null);
  const [clients,     setClients]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [ov, rv, ld, tk, en, cl] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getRevenue(),
        analyticsApi.getLeads(),
        analyticsApi.getTickets(),
        analyticsApi.getEnrollments(),
        analyticsApi.getClients(),
      ]);
      setOverview(ov.data.data.overview);
      setRevenue(rv.data.data.revenue);
      setLeads(ld.data.data);
      setTickets(tk.data.data);
      setEnrollments(en.data.data);
      setClients(cl.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load analytics');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { overview, revenue, leads, tickets, enrollments, clients, loading, error, refetch: fetchAll };
};