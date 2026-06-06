import { useState } from 'react';
import { useServiceCategories } from '../hooks/useServiceCategories';
import Table from '../../../shared/components/ui/Table';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, FormField, Input, ConfirmDialog } from '../../../shared/components/ui/index';

const emptyForm = { name: '', description: '', icon: '', order: 0 };

const ServiceCategoriesPage = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useServiceCategories();

  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [formError, setFormError]       = useState('');
  const [form, setForm]                 = useState(emptyForm);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleOpenEdit = (cat) => {
    setEditTarget(cat);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '', order: cat.order });
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
      if (editTarget) { await updateCategory(editTarget.id, form); }
      else            { await createCategory(form); }
      handleClose();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try   { await deleteCategory(deleteTarget.id); setDeleteTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      key: 'name', label: 'Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.icon && <span className="text-2xl">{row.icon}</span>}
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.slug}</p>
          </div>
        </div>
      ),
    },
    { key: 'description', label: 'Description', render: (row) => <span className="text-gray-500 text-sm">{row.description || '—'}</span> },
    { key: 'services',    label: 'Services',    render: (row) => <Badge color="teal">{row.serviceCount} services</Badge> },
    { key: 'status',      label: 'Status',      render: (row) => <Badge color={row.isActive ? 'green' : 'gray'}>{row.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'order',       label: 'Order',       render: (row) => <span className="text-gray-500">{row.order}</span> },
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
          <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>+ New Category</Button>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <Table columns={columns} data={categories} loading={loading} emptyMessage="No categories yet" />

      <Modal isOpen={createOpen || !!editTarget} onClose={handleClose} title={editTarget ? 'Edit Category' : 'Create Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>}
          <FormField label="Name" required>
            <Input value={form.name} onChange={set('name')} placeholder="e.g. Web Development" />
          </FormField>
          <FormField label="Description">
            <Input value={form.description} onChange={set('description')} placeholder="Short description" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Icon (emoji)">
              <Input value={form.icon} onChange={set('icon')} placeholder="e.g. 💻" />
            </FormField>
            <FormField label="Display Order">
              <Input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
            </FormField>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Category'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? This will fail if the category has services.`}
      />
    </div>
  );
};

export default ServiceCategoriesPage;