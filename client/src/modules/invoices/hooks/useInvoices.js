import { useState, useEffect, useCallback } from 'react';
import { invoiceApi } from '../api/invoiceApi';
import useDebounce from '../../../shared/hooks/useDebounce';

export const useInvoices = () => {
  const [invoices, setInvoices]     = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const fetchInvoices = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await invoiceApi.list({
        page, limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter    && { status: statusFilter }),
      });
      setInvoices(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load invoices');
    } finally { setLoading(false); }
  }, [page, debouncedSearch, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await invoiceApi.getStats();
      setStats(data.data.stats);
    } catch (_) {}
  }, []);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);
  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const createInvoice = async (formData) => {
    const { data } = await invoiceApi.create(formData);
    await fetchInvoices(); await fetchStats();
    return data.data.invoice;
  };

  const updateInvoice = async (id, formData) => {
    const { data } = await invoiceApi.update(id, formData);
    await fetchInvoices();
    return data.data.invoice;
  };

  const sendInvoice = async (id) => {
    await invoiceApi.send(id);
    await fetchInvoices(); await fetchStats();
  };

  const markPaid = async (id) => {
    await invoiceApi.markPaid(id);
    await fetchInvoices(); await fetchStats();
  };

  const cancelInvoice = async (id) => {
    await invoiceApi.cancel(id);
    await fetchInvoices(); await fetchStats();
  };

  const deleteInvoice = async (id) => {
    await invoiceApi.delete(id);
    await fetchInvoices(); await fetchStats();
  };

  const downloadPDF = async (id, number) => {
    const { data } = await invoiceApi.downloadPDF(id);
    const url  = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href  = url;
    link.setAttribute('download', `${number}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return {
    invoices, stats, loading, error, pagination,
    page, setPage, search, setSearch, statusFilter, setStatusFilter,
    createInvoice, updateInvoice, sendInvoice, markPaid, cancelInvoice, deleteInvoice, downloadPDF,
    refetch: fetchInvoices,
  };
};