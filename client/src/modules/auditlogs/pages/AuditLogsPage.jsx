import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../shared/services/apiClient';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import { SearchInput, Select } from '../../../shared/components/ui/index';

const AuditLogsPage = () => {
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [resource, setResource]   = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/audit-logs', {
        params: {
          page, limit: 20,
          ...(search   && { action: search }),
          ...(resource && { resource }),
        },
      });
      setLogs(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load audit logs');
    } finally { setLoading(false); }
  }, [page, search, resource]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const resources = ['user', 'course', 'client', 'project', 'ticket', 'service', 'role', 'enrollment'];

  const columns = [
    {
      key: 'action', label: 'Action',
      render: (row) => (
        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
          {row.action}
        </span>
      ),
    },
    { key: 'resource',   label: 'Resource',    render: (row) => <span className="text-gray-600 capitalize">{row.resource || '—'}</span> },
    { key: 'resourceId', label: 'Resource ID',  render: (row) => <span className="font-mono text-xs text-gray-400">{row.resourceId ? row.resourceId.slice(0, 12) + '...' : '—'}</span> },
    { key: 'userId',     label: 'User',         render: (row) => <span className="font-mono text-xs text-gray-400">{row.userId ? row.userId.slice(0, 12) + '...' : 'System'}</span> },
    { key: 'ipAddress',  label: 'IP Address',   render: (row) => <span className="text-gray-500 text-xs">{row.ipAddress || '—'}</span> },
    {
      key: 'createdAt', label: 'Timestamp',
      render: (row) => (
        <span className="text-gray-400 text-xs whitespace-nowrap">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-500 text-sm mt-1">{pagination.total} total events</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by action..." />
        </div>
        <Select value={resource} onChange={(e) => setResource(e.target.value)} className="w-40">
          <option value="">All Resources</option>
          {resources.map((r) => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </Select>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <Table columns={columns} data={logs} loading={loading} emptyMessage="No audit logs found" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AuditLogsPage;