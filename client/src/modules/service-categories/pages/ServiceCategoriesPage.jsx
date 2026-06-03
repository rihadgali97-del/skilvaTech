import { useState } from 'react';
import { useServiceCategories } from '../hooks/useServiceCategories';
import Table from '../../../shared/components/ui/Table';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, FormField, Input, ConfirmDialog } from '../../../shared/components/ui/index';

const ServiceCategoriesPage = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useServiceCategories();

  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [formError, setFormError]       = useState('');
  const emptyForm = { name: '', description: '', icon: '', order: 0 };
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => { setForm(emptyForm); setFormError(''); };

  const handleOpenEdit = (cat) => {
    setEditTarget(cat);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '', order: cat.order });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    setSubmitting(true);
    try {
      if (editTarget) { await updateCategory(editTarget.id, form); setEditTarget(null); }
      else            { await createCategory(form);                 setCreateOpen(false); }
      resetForm();
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
            <p className="font-medium text-white">{row.name}</p>
            <p className="text-xs text-slate-500">{row.slug}</p>
          </div>
        </div>
      ),
    },
    { key: 'description', label: 'Description', render: (row) => <span className="text-slate-400 text-sm">{row.description || '—'}</span> },
    { key: 'services',    label: 'Services',    render: (row) => <Badge color="blue">{row.serviceCount} services</Badge> },
    { key: 'status',      label: 'Status',      render: (row) => <Badge color={row.isActive ? 'green' : 'red'}>{row.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'order',       label: 'Order',       render: (row) => <span className="text-slate-400">{row.order}</span> },
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

  const CategoryForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{formError}</div>}
      <FormField label="Name" required>
        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Web Development" />
      </FormField>
      <FormField label="Description">
        <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short description" />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Icon (emoji)">
          <Input value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="e.g. 💻" />
        </FormField>
        <FormField label="Display Order">
          <Input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
        </FormField>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={() => { setCreateOpen(false); setEditTarget(null); resetForm(); }}>Cancel</Button>
        <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Category'}</Button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Service Categories</h1>
          <p className="text-slate-400 text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true); }}>+ New Category</Button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <Table columns={columns} data={categories} loading={loading} emptyMessage="No categories yet" />

      <Modal isOpen={createOpen}   onClose={() => { setCreateOpen(false); resetForm(); }} title="Create Category"><CategoryForm /></Modal>
      <Modal isOpen={!!editTarget} onClose={() => { setEditTarget(null);  resetForm(); }} title="Edit Category"><CategoryForm /></Modal>

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