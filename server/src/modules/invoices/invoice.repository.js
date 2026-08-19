import prisma from '../../config/db.js';

const invoiceSelect = {
  id: true, number: true, status: true, subtotal: true, tax: true,
  amount: true, currency: true, issuedAt: true, dueDate: true,
  paidAt: true, notes: true, terms: true,
  createdAt: true, updatedAt: true,
  client: { select: { id: true, name: true, email: true, company: true, address: true } },
  items: { orderBy: { order: 'asc' } },
};

export const findInvoices = ({ skip, take, where, orderBy }) =>
  prisma.invoice.findMany({ skip, take, where, orderBy, select: invoiceSelect });

export const countInvoices = (where) => prisma.invoice.count({ where });

export const findInvoiceById = (id) =>
  prisma.invoice.findUnique({ where: { id }, select: invoiceSelect });

export const findInvoiceByNumber = (number) =>
  prisma.invoice.findUnique({ where: { number } });

export const createInvoiceWithItems = (data, items) =>
  prisma.invoice.create({
    data: {
      ...data,
      items: { create: items },
    },
    select: invoiceSelect,
  });

export const updateInvoiceWithItems = async (id, data, items) => {
  // Replace all line items: delete old, create new (simplest consistent approach)
  return prisma.$transaction(async (tx) => {
    if (items) {
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
    }
    return tx.invoice.update({
      where: { id },
      data: {
        ...data,
        ...(items && { items: { create: items } }),
      },
      select: invoiceSelect,
    });
  });
};

export const updateInvoiceStatus = (id, status, extra = {}) =>
  prisma.invoice.update({
    where: { id },
    data:  { status, ...extra },
    select: invoiceSelect,
  });

export const deleteInvoice = (id) =>
  prisma.invoice.delete({ where: { id } });

// ─── Get the highest invoice number for auto-generation ───────────────────────
export const getLastInvoiceNumber = async () => {
  const last = await prisma.invoice.findFirst({
    orderBy: { createdAt: 'desc' },
    select:  { number: true },
  });
  return last?.number || null;
};

// ─── Mark overdue invoices (used by a scheduled job or on-demand check) ───────
export const markOverdueInvoices = () =>
  prisma.invoice.updateMany({
    where: {
      status:  { in: ['sent'] },
      dueDate: { lt: new Date() },
    },
    data: { status: 'overdue' },
  });

// ─── Aggregate stats for invoice dashboard ─────────────────────────────────────
export const getInvoiceStats = async () => {
  const [totalOutstanding, totalPaid, totalOverdue, statusCounts] = await Promise.all([
    prisma.invoice.aggregate({
      where: { status: { in: ['sent', 'overdue'] } },
      _sum:  { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { status: 'paid' },
      _sum:  { amount: true },
    }),
    prisma.invoice.count({ where: { status: 'overdue' } }),
    prisma.invoice.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
  ]);

  return {
    totalOutstanding: totalOutstanding._sum.amount || 0,
    totalPaid:        totalPaid._sum.amount || 0,
    overdueCount:     totalOverdue,
    byStatus: statusCounts.reduce((acc, s) => ({ ...acc, [s.status]: s._count.status }), {}),
  };
};