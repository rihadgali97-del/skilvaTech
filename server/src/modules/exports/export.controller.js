// export.controller.js
// Add these handlers to client.controller.js and lead.controller.js

import { toCSV, sendCSV } from '../../shared/utils/csv.utils.js';
import prisma from '../../config/db.js';

// ── Export Clients ─────────────────────────────────────────────────────────────
export const exportClients = async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        name: true, email: true, phone: true, company: true,
        address: true, website: true, isActive: true,
        createdAt: true,
        _count: { select: { projects: true, leads: true } },
      },
    });

    const rows = clients.map((c) => ({
      name:          c.name,
      email:         c.email,
      phone:         c.phone || '',
      company:       c.company || '',
      address:       c.address || '',
      website:       c.website || '',
      status:        c.isActive ? 'Active' : 'Inactive',
      projects:      c._count.projects,
      leads:         c._count.leads,
      joined:        new Date(c.createdAt).toLocaleDateString(),
    }));

    const csv = toCSV(rows, ['name','email','phone','company','address','website','status','projects','leads','joined'], {
      name:     'Name',
      email:    'Email',
      phone:    'Phone',
      company:  'Company',
      address:  'Address',
      website:  'Website',
      status:   'Status',
      projects: 'Projects',
      leads:    'Leads',
      joined:   'Joined',
    });

    sendCSV(res, csv, `clients-export-${new Date().toISOString().slice(0,10)}`);
  } catch (err) { next(err); }
};

// ── Export Leads ───────────────────────────────────────────────────────────────
export const exportLeads = async (req, res, next) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        name: true, email: true, phone: true, company: true,
        source: true, status: true, value: true, notes: true,
        createdAt: true,
        assignedTo: { select: { firstName: true, lastName: true } },
      },
    });

    const rows = leads.map((l) => ({
      name:       l.name,
      email:      l.email,
      phone:      l.phone || '',
      company:    l.company || '',
      source:     l.source || '',
      status:     l.status,
      value:      l.value ? parseFloat(l.value).toFixed(2) : '',
      assignedTo: l.assignedTo ? `${l.assignedTo.firstName} ${l.assignedTo.lastName}` : '',
      notes:      l.notes || '',
      created:    new Date(l.createdAt).toLocaleDateString(),
    }));

    const csv = toCSV(rows, ['name','email','phone','company','source','status','value','assignedTo','notes','created'], {
      name:       'Name',
      email:      'Email',
      phone:      'Phone',
      company:    'Company',
      source:     'Source',
      status:     'Status',
      value:      'Value (USD)',
      assignedTo: 'Assigned To',
      notes:      'Notes',
      created:    'Created',
    });

    sendCSV(res, csv, `leads-export-${new Date().toISOString().slice(0,10)}`);
  } catch (err) { next(err); }
};