import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useClients } from '../../clients/hooks/useClients';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, SearchInput, Select, FormField, Input, Textarea, ConfirmDialog } from '../../../shared/components/ui/index';

const statusColors   = { planning: 'blue', active: 'teal', on_hold: 'yellow', completed: 'green', cancelled: 'red' };
const priorityColors = { low: 'gray', medium: 'blue', high: 'orange', urgent: 'red' };
const emptyForm      = { name: '', description: '', status: 'planning', priority: 'medium', startDate: '', endDate: '', budget: '', clientId: '' };

const ProjectsPage = () => {
  const {
    projects, loading, error, pagination,
    page, setPage, search, setSearch,
    statusFilter, setStatusFilter,
    createProject, updateProject, deleteProject,
  } = useProjects();

  const { clients } = useClients();

  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [formError, setFormError]       = useState('');
  const [form, setForm]                 = useState(emptyForm);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleOpenEdit = (project) => {
    setEditTarget(project);
    setForm({
      name:        project.name,
      description: project.description || '',
      status:      project.status,
      priority:    project.priority,
      startDate:   project.startDate ? project.startDate.slice(0, 10) : '',
      endDate:     project.endDate   ? project.endDate.slice(0, 10)   : '',
      budget:      project.budget    || '',
      clientId:    project.client?.id || '',
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
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        budget:    form.budget    ? parseFloat(form.budget)                : undefined,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate:   form.endDate   ? new Date(form.endDate).toISOString()   : undefined,
        clientId:  form.clientId  || undefined,
      };
      if (editTarget) { await updateProject(editTarget.id, payload); }
      else            { await createProject(payload); }
      handleClose();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try   { await deleteProject(deleteTarget.id); setDeleteTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      key: 'name', label: 'Project',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.client?.name || 'No client'}</p>
        </div>
      ),
    },
    { key: 'status',   label: 'Status',   render: (row) => <Badge color={statusColors[row.status]}>{row.status.replace('_', ' ')}</Badge> },
    { key: 'priority', label: 'Priority', render: (row) => <Badge color={priorityColors[row.priority]}>{row.priority}</Badge> },
    {
      key: 'manager', label: 'Manager',
      render: (row) => <span className="text-gray-600 text-sm">{row.manager ? `${row.manager.firstName} ${row.manager.lastName}` : '—'}</span>,
    },
    {
      key: 'budget', label: 'Budget',
      render: (row) => <span className="font-medium text-gray-700">{row.budget ? `$${parseFloat(row.budget).toLocaleString()}` : '—'}</span>,
    },
    { key: 'tickets', label: 'Tickets', render: (row) => <Badge color="gray">{row.ticketCount} tickets</Badge> },
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
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total projects</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>+ New Project</Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44">
          <option value="">All Status</option>
          {['planning','active','on_hold','completed','cancelled'].map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
          ))}
        </Select>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <Table columns={columns} data={projects} loading={loading} emptyMessage="No projects yet" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={createOpen || !!editTarget}
        onClose={handleClose}
        title={editTarget ? 'Edit Project' : 'Create Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <FormField label="Project Name" required>
            <Input value={form.name} onChange={set('name')} placeholder="Project name" />
          </FormField>
          <FormField label="Description">
            <Textarea rows={3} value={form.description} onChange={set('description')} placeholder="What is this project about?" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status">
              <Select value={form.status} onChange={set('status')}>
                {['planning','active','on_hold','completed','cancelled'].map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date">
              <Input type="date" value={form.startDate} onChange={set('startDate')} />
            </FormField>
            <FormField label="End Date">
              <Input type="date" value={form.endDate} onChange={set('endDate')} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Budget (USD)">
              <Input type="number" step="0.01" value={form.budget} onChange={set('budget')} placeholder="0.00" />
            </FormField>
            <FormField label="Client">
              <Select value={form.clientId} onChange={set('clientId')}>
                <option value="">No client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Project'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Project" message={`Delete "${deleteTarget?.name}"?`}
      />
    </div>
  );
};

export default ProjectsPage;