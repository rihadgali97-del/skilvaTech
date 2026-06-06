import { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import { useProjects } from '../../projects/hooks/useProjects';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, SearchInput, Select, FormField, Input, Textarea, ConfirmDialog } from '../../../shared/components/ui/index';

const statusColors   = { open: 'blue', in_progress: 'yellow', resolved: 'green', closed: 'gray' };
const priorityColors = { low: 'gray', medium: 'blue', high: 'orange', urgent: 'red' };
const typeColors     = { support: 'blue', bug: 'red', feature: 'teal', maintenance: 'yellow' };
const emptyForm      = { title: '', description: '', status: 'open', priority: 'medium', type: 'support', projectId: '' };

const TicketsPage = () => {
  const {
    tickets, loading, error, pagination,
    page, setPage, search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    createTicket, updateTicket, deleteTicket,
  } = useTickets();

  const { projects } = useProjects();

  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [formError, setFormError]       = useState('');
  const [form, setForm]                 = useState(emptyForm);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleOpenEdit = (ticket) => {
    setEditTarget(ticket);
    setForm({
      title:       ticket.title,
      description: ticket.description || '',
      status:      ticket.status,
      priority:    ticket.priority,
      type:        ticket.type,
      projectId:   ticket.project?.id || '',
    });
  };

  const handleClose = () => {
    setCreateOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Title is required'); return; }
    setSubmitting(true);
    try {
      const payload = { ...form, projectId: form.projectId || undefined };
      if (editTarget) { await updateTicket(editTarget.id, payload); }
      else            { await createTicket(payload); }
      handleClose();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try   { await deleteTicket(deleteTarget.id); setDeleteTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      key: 'title', label: 'Ticket',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">{row.project?.name || 'No project'}</p>
        </div>
      ),
    },
    { key: 'type',     label: 'Type',     render: (row) => <Badge color={typeColors[row.type]}>{row.type}</Badge> },
    { key: 'status',   label: 'Status',   render: (row) => <Badge color={statusColors[row.status]}>{row.status.replace('_', ' ')}</Badge> },
    { key: 'priority', label: 'Priority', render: (row) => <Badge color={priorityColors[row.priority]}>{row.priority}</Badge> },
    {
      key: 'assignedTo', label: 'Assigned To',
      render: (row) => <span className="text-gray-600 text-sm">{row.assignedTo ? `${row.assignedTo.firstName} ${row.assignedTo.lastName}` : '—'}</span>,
    },
    {
      key: 'createdAt', label: 'Created',
      render: (row) => <span className="text-gray-400 text-xs">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(row)}>Edit</Button>
          <Button size="sm" variant="danger"    onClick={() => setDeleteTarget(row)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total tickets</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>+ New Ticket</Button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-48 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search tickets..." />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option value="">All Status</option>
          {['open','in_progress','resolved','closed'].map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
          ))}
        </Select>
        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-36">
          <option value="">All Priority</option>
          {['low','medium','high','urgent'].map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </Select>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <Table columns={columns} data={tickets} loading={loading} emptyMessage="No tickets yet" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={createOpen || !!editTarget}
        onClose={handleClose}
        title={editTarget ? 'Edit Ticket' : 'Create Ticket'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <FormField label="Title" required>
            <Input value={form.title} onChange={set('title')} placeholder="Describe the issue briefly" />
          </FormField>
          <FormField label="Description">
            <Textarea rows={3} value={form.description} onChange={set('description')} placeholder="Detailed description..." />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Type">
              <Select value={form.type} onChange={set('type')}>
                {['support','bug','feature','maintenance'].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Priority">
              <Select value={form.priority} onChange={set('priority')}>
                {['low','medium','high','urgent'].map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Status">
              <Select value={form.status} onChange={set('status')}>
                {['open','in_progress','resolved','closed'].map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </Select>
            </FormField>
          </div>
          <FormField label="Project">
            <Select value={form.projectId} onChange={set('projectId')}>
              <option value="">No project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Ticket'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Ticket" message={`Delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
};

export default TicketsPage;