import { useState } from 'react';
import { useInvoices } from '../hooks/useInvoices';
import { useClients } from '../../clients/hooks/useClients';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, SearchInput, Select, FormField, Input, Textarea, ConfirmDialog } from '../../../shared/components/ui/index';

const statusColors = { draft: 'gray', sent: 'blue', paid: 'green', overdue: 'red', cancelled: 'gray' };

const emptyItem = { description: '', quantity: 1, unitPrice: '' };
const emptyForm = { clientId: '', dueDate: '', taxRate: 0, notes: '', terms: '', currency: 'USD', items: [{ ...emptyItem }] };

const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const InvoicesPage = () => {
  const {
    invoices, stats, loading, error, pagination,
    page, setPage, search, setSearch, statusFilter, setStatusFilter,
    createInvoice, updateInvoice, sendInvoice, markPaid, cancelInvoice, deleteInvoice, downloadPDF,
  } = useInvoices();
  const { clients } = useClients();

  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [viewTarget, setViewTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [formError, setFormError]       = useState('');
  const [form, setForm]                 = useState(emptyForm);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  // ── Line item handlers ─────────────────────────────────────────────────────
  const setItem = (idx, key) => (e) => {
    const value = e.target.value;
    setForm((p) => {
      const items = [...p.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...p, items };
    });
  };

  const addItem = () => setForm((p) => ({ ...p, items: [...p.items, { ...emptyItem }] }));
  const removeItem = (idx) => setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));

  const calcTotals = () => {
    const subtotal = form.items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0);
    const tax = subtotal * ((Number(form.taxRate) || 0) / 100);
    return { subtotal, tax, total: subtotal + tax };
  };

  // ── Open/close handlers ─────────────────────────────────────────────────────
  const handleOpenEdit = (invoice) => {
    setEditTarget(invoice);
    setForm({
      clientId: invoice.client.id,
      dueDate:  invoice.dueDate ? invoice.dueDate.slice(0, 10) : '',
      taxRate:  invoice.subtotal > 0 ? Math.round((invoice.tax / invoice.subtotal) * 100) : 0,
      notes:    invoice.notes || '',
      terms:    invoice.terms || '',
      currency: invoice.currency,
      items:    invoice.items.map((i) => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })),
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
    if (!form.clientId) { setFormError('Client is required'); return; }
    if (form.items.some((i) => !i.description.trim() || !i.unitPrice)) {
      setFormError('All line items need a description and price'); return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        taxRate: Number(form.taxRate) || 0,
        items: form.items.map((i) => ({ ...i, quantity: Number(i.quantity) || 1, unitPrice: Number(i.unitPrice) })),
      };
      if (editTarget) { await updateInvoice(editTarget.id, payload); }
      else            { await createInvoice(payload); }
      handleClose();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  // ── Lifecycle action handlers ───────────────────────────────────────────────
  const runAction = async (id, action, fn) => {
    setActionLoading(`${id}-${action}`);
    try { await fn(id); }
    catch (err) { alert(err.response?.data?.error?.message || 'Action failed'); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try   { await deleteInvoice(deleteTarget.id); setDeleteTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleCancelInvoice = async () => {
    setSubmitting(true);
    try   { await cancelInvoice(cancelTarget.id); setCancelTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  // ── Table columns ───────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'number', label: 'Invoice',
      render: (row) => (
        <button onClick={() => setViewTarget(row)} className="text-left hover:text-[#00b3b3] transition-colors">
          <p className="font-semibold text-gray-900 font-mono text-sm">{row.number}</p>
          <p className="text-xs text-gray-500">{row.client.name}</p>
        </button>
      ),
    },
    { key: 'status', label: 'Status', render: (row) => <Badge color={statusColors[row.status]}>{row.status}</Badge> },
    {
      key: 'amount', label: 'Amount',
      render: (row) => <span className="font-semibold text-gray-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: row.currency }).format(row.amount)}</span>,
    },
    {
      key: 'dueDate', label: 'Due Date',
      render: (row) => <span className="text-gray-500 text-sm">{row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—'}</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-1.5 flex-wrap">
          <Button size="sm" variant="secondary" onClick={() => downloadPDF(row.id, row.number)}>↓ PDF</Button>
          {row.status === 'draft' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(row)}>Edit</Button>
              <Button size="sm" loading={actionLoading === `${row.id}-send`} onClick={() => runAction(row.id, 'send', sendInvoice)}>Send</Button>
              <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>Delete</Button>
            </>
          )}
          {(row.status === 'sent' || row.status === 'overdue') && (
            <>
              <Button size="sm" loading={actionLoading === `${row.id}-paid`} onClick={() => runAction(row.id, 'paid', markPaid)}>Mark Paid</Button>
              <Button size="sm" variant="danger" onClick={() => setCancelTarget(row)}>Cancel</Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const { subtotal, tax, total } = calcTotals();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total invoices</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>+ New Invoice</Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Outstanding" value={`$${Number(stats.totalOutstanding).toLocaleString()}`} color="text-amber-600" />
          <StatCard label="Total Paid"  value={`$${Number(stats.totalPaid).toLocaleString()}`}        color="text-emerald-600" />
          <StatCard label="Overdue"     value={stats.overdueCount}                                     color="text-red-600" />
          <StatCard label="Drafts"      value={stats.byStatus.draft || 0}                               color="text-gray-600" />
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search invoice number..." />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option value="">All Status</option>
          {['draft','sent','paid','overdue','cancelled'].map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </Select>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <Table columns={columns} data={invoices} loading={loading} emptyMessage="No invoices yet" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* ── Create / Edit Modal ── */}
      <Modal isOpen={createOpen || !!editTarget} onClose={handleClose} title={editTarget ? 'Edit Invoice' : 'Create Invoice'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>}

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Client" required>
              <Select value={form.clientId} onChange={set('clientId')}>
                <option value="">Select client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.company || c.email}</option>)}
              </Select>
            </FormField>
            <FormField label="Due Date">
              <Input type="date" value={form.dueDate} onChange={set('dueDate')} />
            </FormField>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Line Items</label>
              <Button type="button" size="sm" variant="outline" onClick={addItem}>+ Add Item</Button>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <div className="col-span-6">Description</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3">Unit Price</div>
                <div className="col-span-1"></div>
              </div>
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 px-3 py-2 border-t border-gray-100 items-center">
                  <input className="col-span-6 px-2 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4]"
                    value={item.description} onChange={setItem(idx, 'description')} placeholder="e.g. Web development services" />
                  <input type="number" min="1" className="col-span-2 px-2 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4]"
                    value={item.quantity} onChange={setItem(idx, 'quantity')} />
                  <input type="number" min="0" step="0.01" className="col-span-3 px-2 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4]"
                    value={item.unitPrice} onChange={setItem(idx, 'unitPrice')} placeholder="0.00" />
                  <button type="button" onClick={() => removeItem(idx)} disabled={form.items.length === 1}
                    className="col-span-1 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tax Rate (%)">
              <Input type="number" min="0" max="100" value={form.taxRate} onChange={set('taxRate')} />
            </FormField>
            <FormField label="Currency">
              <Select value={form.currency} onChange={set('currency')}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Notes">
            <Textarea rows={2} value={form.notes} onChange={set('notes')} placeholder="Additional notes for the client..." />
          </FormField>
          <FormField label="Terms & Conditions">
            <Textarea rows={2} value={form.terms} onChange={set('terms')} placeholder="Payment terms, late fees, etc." />
          </FormField>

          {/* Totals preview */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Tax ({form.taxRate || 0}%)</span><span className="text-gray-900 font-medium">${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-base pt-1.5 border-t border-gray-200"><span className="font-semibold text-gray-900">Total</span><span className="font-bold text-[#00b3b3]">${total.toFixed(2)}</span></div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Draft'}</Button>
          </div>
        </form>
      </Modal>

      {/* ── View Invoice Modal ── */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title={viewTarget?.number} size="lg">
        {viewTarget && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge color={statusColors[viewTarget.status]}>{viewTarget.status}</Badge>
              <Button size="sm" variant="secondary" onClick={() => downloadPDF(viewTarget.id, viewTarget.number)}>↓ Download PDF</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs mb-1">Client</p><p className="text-gray-900 font-medium">{viewTarget.client.name}</p></div>
              <div><p className="text-gray-400 text-xs mb-1">Due Date</p><p className="text-gray-900 font-medium">{viewTarget.dueDate ? new Date(viewTarget.dueDate).toLocaleDateString() : '—'}</p></div>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {viewTarget.items.map((item) => (
                <div key={item.id} className="flex justify-between px-4 py-2.5 border-b border-gray-100 last:border-0 text-sm">
                  <span className="text-gray-700">{item.description} × {item.quantity}</span>
                  <span className="font-medium text-gray-900">${Number(item.total).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-lg pt-2">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-[#00b3b3]">{new Intl.NumberFormat('en-US', { style: 'currency', currency: viewTarget.currency }).format(viewTarget.amount)}</span>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={submitting}
        title="Delete Invoice" message={`Delete draft "${deleteTarget?.number}"?`} />
      <ConfirmDialog isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={handleCancelInvoice} loading={submitting}
        title="Cancel Invoice" message={`Cancel invoice "${cancelTarget?.number}"? This cannot be undone.`} />
    </div>
  );
};

export default InvoicesPage;