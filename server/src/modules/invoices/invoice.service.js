import * as invoiceRepo from './invoice.repository.js';
import { findClientById } from '../clients/client.repository.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../shared/errors/AppError.js';
import { parsePagination, parseSort } from '../../shared/utils/pagination.utils.js';

// ─── Generate the next invoice number — INV-2026-0001 format ─────────────────
const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const last = await invoiceRepo.getLastInvoiceNumber();

  let nextSeq = 1;
  if (last) {
    const match = last.match(/INV-(\d{4})-(\d+)/);
    if (match && parseInt(match[1]) === year) {
      nextSeq = parseInt(match[2]) + 1;
    }
  }

  return `INV-${year}-${String(nextSeq).padStart(4, '0')}`;
};

// ─── Calculate totals from line items ──────────────────────────────────────────
const calculateTotals = (items, taxRate = 0) => {
  const lineItems = items.map((item, i) => ({
    description: item.description,
    quantity:    item.quantity,
    unitPrice:   item.unitPrice,
    total:       item.quantity * item.unitPrice,
    order:       i,
  }));

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const tax      = subtotal * (taxRate / 100);
  const amount   = subtotal + tax;

  return { lineItems, subtotal, tax, amount };
};

// ─── List invoices ──────────────────────────────────────────────────────────────
export const listInvoices = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'dueDate', 'amount', 'number']);

  const where = {};
  if (query.search)   where.number   = { contains: query.search, mode: 'insensitive' };
  if (query.status)   where.status   = query.status;
  if (query.clientId) where.clientId = query.clientId;

  // Auto-mark overdue invoices before listing
  await invoiceRepo.markOverdueInvoices();

  const [data, total] = await Promise.all([
    invoiceRepo.findInvoices({ skip, take: limit, where, orderBy }),
    invoiceRepo.countInvoices(where),
  ]);

  return { data, total, page, limit };
};

// ─── Get one invoice ─────────────────────────────────────────────────────────────
export const getInvoiceById = async (id) => {
  const invoice = await invoiceRepo.findInvoiceById(id);
  if (!invoice) throw new NotFoundError('Invoice');
  return invoice;
};

// ─── Create invoice ──────────────────────────────────────────────────────────────
export const createInvoice = async (data) => {
  const client = await findClientById(data.clientId);
  if (!client) throw new NotFoundError('Client');

  const number = await generateInvoiceNumber();
  const { lineItems, subtotal, tax, amount } = calculateTotals(data.items, data.taxRate);

  const invoice = await invoiceRepo.createInvoiceWithItems(
    {
      number,
      clientId: data.clientId,
      subtotal, tax, amount,
      currency: data.currency || 'USD',
      dueDate:  data.dueDate ? new Date(data.dueDate) : undefined,
      notes:    data.notes,
      terms:    data.terms,
      status:   'draft',
    },
    lineItems
  );

  return invoice;
};

// ─── Update invoice (only allowed while draft) ───────────────────────────────────
export const updateInvoice = async (id, data) => {
  const existing = await invoiceRepo.findInvoiceById(id);
  if (!existing) throw new NotFoundError('Invoice');
  if (existing.status !== 'draft') {
    throw new ForbiddenError('Only draft invoices can be edited. Cancel and create a new one instead.');
  }

  let updateData = {
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    notes:   data.notes,
    terms:   data.terms,
    currency: data.currency,
  };

  let lineItems;
  if (data.items) {
    const { lineItems: items, subtotal, tax, amount } = calculateTotals(data.items, data.taxRate ?? 0);
    lineItems = items;
    updateData = { ...updateData, subtotal, tax, amount };
  }

  if (data.clientId && data.clientId !== existing.client.id) {
    const client = await findClientById(data.clientId);
    if (!client) throw new NotFoundError('Client');
    updateData.clientId = data.clientId;
  }

  return invoiceRepo.updateInvoiceWithItems(id, updateData, lineItems);
};

// ─── Status transitions ──────────────────────────────────────────────────────────
export const sendInvoice = async (id) => {
  const invoice = await invoiceRepo.findInvoiceById(id);
  if (!invoice) throw new NotFoundError('Invoice');
  if (invoice.status === 'paid')      throw new BadRequestError('Invoice is already paid');
  if (invoice.status === 'cancelled') throw new BadRequestError('Cannot send a cancelled invoice');

  return invoiceRepo.updateInvoiceStatus(id, 'sent');
};

export const markAsPaid = async (id) => {
  const invoice = await invoiceRepo.findInvoiceById(id);
  if (!invoice) throw new NotFoundError('Invoice');
  if (invoice.status === 'cancelled') throw new BadRequestError('Cannot mark a cancelled invoice as paid');

  return invoiceRepo.updateInvoiceStatus(id, 'paid', { paidAt: new Date() });
};

export const cancelInvoice = async (id) => {
  const invoice = await invoiceRepo.findInvoiceById(id);
  if (!invoice) throw new NotFoundError('Invoice');
  if (invoice.status === 'paid') throw new BadRequestError('Cannot cancel a paid invoice');

  return invoiceRepo.updateInvoiceStatus(id, 'cancelled');
};

// ─── Delete (only drafts) ─────────────────────────────────────────────────────────
export const deleteInvoice = async (id) => {
  const invoice = await invoiceRepo.findInvoiceById(id);
  if (!invoice) throw new NotFoundError('Invoice');
  if (invoice.status !== 'draft') {
    throw new ForbiddenError('Only draft invoices can be deleted. Cancel it instead.');
  }
  await invoiceRepo.deleteInvoice(id);
};

// ─── Stats ────────────────────────────────────────────────────────────────────────
export const getStats = () => invoiceRepo.getInvoiceStats();