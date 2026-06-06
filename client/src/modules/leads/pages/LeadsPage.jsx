import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, SearchInput, Select, FormField, Input, ConfirmDialog } from '../../../shared/components/ui/index';

const statusColors = { new: 'blue', contacted: 'yellow', qualified: 'teal', lost: 'red', converted: 'green' };
const sourceColors = { website: 'blue', referral: 'green', social: 'purple', email: 'yellow', phone: 'teal', other: 'gray' };
const emptyForm    = { name: '', email: '', phone: '', company: '', source: '', status: 'new', notes: '', value: '' };

const LeadsPage = () => {
  const {
    leads, loading, error, pagination,
    page, setPage, search, setSearch,
    statusFilter, setStatusFilter,
    createLead, updateLead, deleteLead,
  } = useLeads();

  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [formError, setFormError]       = useState('');
  const [form, setForm]                 = useState(emptyForm);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleOpenEdit = (lead) => {
    setEditTarget(lead);
    setForm({
      name: lead.name, email: lead.email,
      phone: lead.phone || '', company: lead.company || '',
      source: lead.source || '', status: lead.status,
      notes: lead.notes || '', value: lead.value || '',
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
      const payload = { ...form, value: form.value ? parseFloat(form.value) : undefined };
      if (editTarget) { await updateLead(editTarget.id, payload); }
      else            { await createLead(payload); }
      handleClose();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try   { await deleteLead(deleteTarget.id); setDeleteTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      key: 'name', label: 'Lead',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'company', label: 'Company', render: (row) => <span className="text-gray-600">{row.company || '—'}</span> },
    { key: 'source',  label: 'Source',  render: (row) => row.source ? <Badge color={sourceColors[row.source] || 'gray'}>{row.source}</Badge> : <span className="text-gray-400">—</span> },
    { key: 'status',  label: 'Status',  render: (row) => <Badge color={statusColors[row.status]}>{row.status}</Badge> },
    { key: 'value',   label: 'Value',   render: (row) => <span className="font-medium text-gray-700">{row.value ? `$${parseFloat(row.value).toLocaleString()}` : '—'}</span> },
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
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total leads</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>+ New Lead</Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search leads..." />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option value="">All Status</option>
          {['new','contacted','qualified','lost','converted'].map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </Select>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <Table columns={columns} data={leads} loading={loading} emptyMessage="No leads yet" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={createOpen || !!editTarget}
        onClose={handleClose}
        title={editTarget ? 'Edit Lead' : 'Add New Lead'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input value={form.name} onChange={set('name')} placeholder="Jane Smith" />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" />
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
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Source">
              <Select value={form.source} onChange={set('source')}>
                <option value="">Select source</option>
                {['website','referral','social','email','phone','other'].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Status">
              <Select value={form.status} onChange={set('status')}>
                {['new','contacted','qualified','lost','converted'].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </Select>
            </FormField>
          </div>
          <FormField label="Estimated Value (USD)">
            <Input type="number" step="0.01" value={form.value} onChange={set('value')} placeholder="0.00" />
          </FormField>
          <FormField label="Notes">
            <Input value={form.notes} onChange={set('notes')} placeholder="Any notes..." />
          </FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Lead'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Lead" message={`Delete lead "${deleteTarget?.name}"?`}
      />
    </div>
  );
};

export default LeadsPage;