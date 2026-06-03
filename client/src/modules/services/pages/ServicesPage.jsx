import { useState } from 'react';
import { useServices } from '../hooks/useServices';
import { useServiceCategories } from '../../service-categories/hooks/useServiceCategories';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, SearchInput, FormField, Input, Select, ConfirmDialog } from '../../../shared/components/ui/index';

const ServicesPage = () => {
  const {
    services, loading, error, pagination,
    page, setPage, search, setSearch,
    categoryFilter, setCategoryFilter,
    createService, updateService, deleteService,
  } = useServices();

  const { categories } = useServiceCategories();

  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [formError, setFormError]       = useState('');

  const emptyForm = { name: '', description: '', categoryId: '', price: '', icon: '', isActive: true, isFeatured: false, order: 0 };
  const [form, setForm] = useState(emptyForm);

  const handleOpenEdit = (service) => {
    setEditTarget(service);
    setForm({
      name:        service.name,
      description: service.description || '',
      categoryId:  service.category?.id || '',
      price:       service.price || '',
      icon:        service.icon || '',
      isActive:    service.isActive,
      isFeatured:  service.isFeatured,
      order:       service.order,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())     { setFormError('Name is required');     return; }
    if (!form.categoryId)      { setFormError('Category is required'); return; }
    setSubmitting(true);
    try {
      const payload = { ...form, price: form.price ? parseFloat(form.price) : undefined };
      if (editTarget) { await updateService(editTarget.id, payload); setEditTarget(null); }
      else            { await createService(payload);                 setCreateOpen(false); }
      setForm(emptyForm); setFormError('');
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try   { await deleteService(deleteTarget.id); setDeleteTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      key: 'name',
      label: 'Service',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.icon && <span className="text-xl">{row.icon}</span>}
          <div>
            <p className="font-medium text-white">{row.name}</p>
            <p className="text-xs text-slate-500">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <Badge color="violet">{row.category?.name || '—'}</Badge>,
    },
    {
      key: 'price',
      label: 'Price',
      render: (row) => (
        <span className="text-slate-300">
          {row.price ? `$${parseFloat(row.price).toFixed(2)}` : 'Free'}
        </span>
      ),
    },
    {
      key: 'badges',
      label: 'Status',
      render: (row) => (
        <div className="flex gap-1.5">
          <Badge color={row.isActive ? 'green' : 'red'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>
          {row.isFeatured && <Badge color="yellow">Featured</Badge>}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(row)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>Delete</Button>
        </div>
      ),
    },
  ];

  const ServiceForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{formError}</div>
      )}
      <FormField label="Name" required>
        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Website Design" />
      </FormField>
      <FormField label="Category" required>
        <Select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </FormField>
      <FormField label="Description">
        <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short description" />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Price (USD)">
          <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="0.00" />
        </FormField>
        <FormField label="Icon (emoji)">
          <Input value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="e.g. 🎨" />
        </FormField>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            className="rounded border-slate-600 bg-slate-800 text-violet-600" />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
            className="rounded border-slate-600 bg-slate-800 text-violet-600" />
          Featured
        </label>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={() => { setCreateOpen(false); setEditTarget(null); setForm(emptyForm); setFormError(''); }}>Cancel</Button>
        <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Service'}</Button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-slate-400 text-sm mt-1">{pagination.total} total services</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>+ New Service</Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search services..." />
        </div>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-48">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <Table columns={columns} data={services} loading={loading} emptyMessage="No services found" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); setForm(emptyForm); setFormError(''); }} title="Create Service">
        <ServiceForm />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => { setEditTarget(null); setForm(emptyForm); setFormError(''); }} title="Edit Service">
        <ServiceForm />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Service" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ServicesPage;