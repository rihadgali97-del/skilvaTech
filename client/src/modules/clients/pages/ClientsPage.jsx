import { useState } from 'react';
import { useClients } from '../hooks/useClients';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { useExport } from '../../../shared/hooks/useExport';
import { Badge, Button, SearchInput, FormField, Input, ConfirmDialog } from '../../../shared/components/ui/index';

const emptyForm = { name: '', email: '', phone: '', company: '', address: '', website: '', notes: '' };

const ClientsPage = () => {
  const {
    clients, loading, error, pagination,
    page, setPage, search, setSearch,
    createClient, updateClient, deleteClient,
  } = useClients();

  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [formError, setFormError]       = useState('');
  const [form, setForm]                 = useState(emptyForm);
  const { exportCSV, exporting }        = useExport('/exports/clients', 'clients');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleOpenEdit = (client) => {
    setEditTarget(client);
    setForm({
      name: client.name, email: client.email,
      phone: client.phone || '', company: client.company || '',
      address: client.address || '', website: client.website || '',
      notes: client.notes || '',
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
    if (!form.name.trim() || !form.email.trim()) { setFormError('Name and email are required'); return; }
    setSubmitting(true);
    try {
      if (editTarget) { await updateClient(editTarget.id, form); }
      else            { await createClient(form); }
      handleClose();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try   { await deleteClient(deleteTarget.id); setDeleteTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      key: 'name', label: 'Client',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-sm font-bold text-[#00b3b3] flex-shrink-0">
            {row.name[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.company || '—'}</p>
          </div>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: (row) => <span className="text-gray-600">{row.email}</span> },
    { key: 'phone', label: 'Phone', render: (row) => <span className="text-gray-600">{row.phone || '—'}</span> },
    {
      key: 'counts', label: 'Activity',
      render: (row) => (
        <div className="flex gap-1.5">
          <Badge color="teal">{row.projectCount} projects</Badge>
          <Badge color="gray">{row.leadCount} leads</Badge>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (row) => <Badge color={row.isActive ? 'green' : 'gray'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
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
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total clients</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>+ New Client</Button>
        <div className="flex gap-2">
  <Button variant="secondary" onClick={exportCSV} loading={exporting}>
    ↓ Export CSV
  </Button>
</div>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search clients..." />
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <Table columns={columns} data={clients} loading={loading} emptyMessage="No clients yet" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={createOpen || !!editTarget}
        onClose={handleClose}
        title={editTarget ? 'Edit Client' : 'Add New Client'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input value={form.name} onChange={set('name')} placeholder="John Doe" />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" value={form.email} onChange={set('email')} placeholder="john@company.com" disabled={!!editTarget} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone">
              <Input value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" />
            </FormField>
            <FormField label="Company">
              <Input value={form.company} onChange={set('company')} placeholder="Company name" />
            </FormField>
          </div>
          <FormField label="Address">
            <Input value={form.address} onChange={set('address')} placeholder="123 Main St, City" />
          </FormField>
          <FormField label="Website">
            <Input value={form.website} onChange={set('website')} placeholder="https://company.com" />
          </FormField>
          <FormField label="Notes">
            <Input value={form.notes} onChange={set('notes')} placeholder="Any additional notes..." />
          </FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Client'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Client" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ClientsPage;