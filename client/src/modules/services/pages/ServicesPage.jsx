import { useState } from 'react';
import { useServices } from '../hooks/useServices';
import { useServiceCategories } from '../../service-categories/hooks/useServiceCategories';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, SearchInput, FormField, Input, Select, ConfirmDialog } from '../../../shared/components/ui/index';

const emptyForm = { name: '', description: '', categoryId: '', price: '', icon: '', isActive: true, isFeatured: false, order: 0 };

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
  const [form, setForm]                 = useState(emptyForm);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

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

  const handleClose = () => {
    setCreateOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())     { setFormError('Name is required');     return; }
    if (!form.categoryId)      { setFormError('Category is required'); return; }
    setSubmitting(true);
    try {
      const payload = { ...form, price: form.price ? parseFloat(form.price) : undefined };
      if (editTarget) { await updateService(editTarget.id, payload); }
      else            { await createService(payload); }
      handleClose();
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
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <Badge color="teal">{row.category?.name || '—'}</Badge>,
    },
    {
      key: 'price',
      label: 'Price',
      render: (row) => (
        <span className="text-gray-700">
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
          <Button size="sm" variant="danger"    onClick={() => setDeleteTarget(row)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total services</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>+ New Service</Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search services..." />
        </div>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-48">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <Table columns={columns} data={services} loading={loading} emptyMessage="No services found" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={createOpen || !!editTarget}
        onClose={handleClose}
        title={editTarget ? 'Edit Service' : 'Create Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <FormField label="Name" required>
            <Input value={form.name} onChange={set('name')} placeholder="e.g. Website Design" />
          </FormField>
          <FormField label="Category" required>
            <Select value={form.categoryId} onChange={set('categoryId')}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Description">
            <Input value={form.description} onChange={set('description')} placeholder="Short description" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price (USD)">
              <Input type="number" step="0.01" value={form.price} onChange={set('price')} placeholder="0.00" />
            </FormField>
            <FormField label="Icon (emoji)">
              <Input value={form.icon} onChange={set('icon')} placeholder="e.g. 🎨" />
            </FormField>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} />
              Featured
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Service'}</Button>
          </div>
        </form>
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