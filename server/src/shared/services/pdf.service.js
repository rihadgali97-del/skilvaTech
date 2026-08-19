import PDFDocument from 'pdfkit';
import { env } from '../../config/env.js';

// ─── Brand colors ───────────────────────────────────────────────────────────────
const BRAND_TEAL  = '#00d4d4';
const BRAND_NAVY  = '#0d1f2d';
const GRAY_DARK   = '#1f2937';
const GRAY_MEDIUM = '#6b7280';
const GRAY_LIGHT  = '#e5e7eb';

const STATUS_COLORS = {
  draft:     '#6b7280',
  sent:      '#2563eb',
  paid:      '#059669',
  overdue:   '#dc2626',
  cancelled: '#9ca3af',
};

const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * Builds the invoice PDF content onto a given PDFDocument instance.
 * Pure layout logic — does not know about HTTP, streams, or buffers.
 */
const drawInvoice = (doc, invoice) => {
  const pageWidth = doc.page.width - 100;

  // ── Header — brand bar ────────────────────────────────────────────────────────
  doc.rect(0, 0, doc.page.width, 90).fill(BRAND_NAVY);
  doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text('SkilVaTech', 50, 30);
  doc.fillColor(BRAND_TEAL).fontSize(10).font('Helvetica')
     .text('Enterprise Technology Solutions', 50, 56);

  doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold')
     .text(invoice.number, 0, 30, { align: 'right', width: pageWidth + 50 });

  const statusColor = STATUS_COLORS[invoice.status] || GRAY_MEDIUM;
  const statusText  = invoice.status.toUpperCase();
  const badgeWidth  = statusText.length * 7 + 20;
  doc.roundedRect(doc.page.width - 50 - badgeWidth, 56, badgeWidth, 20, 4).fill(statusColor);
  doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
     .text(statusText, doc.page.width - 50 - badgeWidth, 62, { width: badgeWidth, align: 'center' });

  doc.y = 120;

  // ── Bill To / Invoice details ───────────────────────────────────────────────────
  const colY = doc.y;

  doc.fillColor(GRAY_MEDIUM).fontSize(9).font('Helvetica-Bold').text('BILL TO', 50, colY);
  doc.fillColor(GRAY_DARK).fontSize(11).font('Helvetica-Bold').text(invoice.client.name, 50, colY + 16);
  doc.fillColor(GRAY_MEDIUM).fontSize(10).font('Helvetica');
  let clientY = colY + 32;
  if (invoice.client.company) { doc.text(invoice.client.company, 50, clientY); clientY += 14; }
  doc.text(invoice.client.email, 50, clientY); clientY += 14;
  if (invoice.client.address) { doc.text(invoice.client.address, 50, clientY, { width: 220 }); }

  const rightColX = 320;
  doc.fillColor(GRAY_MEDIUM).fontSize(9).font('Helvetica-Bold').text('INVOICE DETAILS', rightColX, colY);

  const details = [
    ['Issue Date', formatDate(invoice.issuedAt)],
    ['Due Date',   formatDate(invoice.dueDate)],
    ['Currency',   invoice.currency],
  ];
  let detailY = colY + 16;
  details.forEach(([label, value]) => {
    doc.fillColor(GRAY_MEDIUM).fontSize(9).font('Helvetica').text(label, rightColX, detailY, { width: 100 });
    doc.fillColor(GRAY_DARK).fontSize(9).font('Helvetica-Bold').text(value, rightColX + 100, detailY, { width: 130, align: 'right' });
    detailY += 16;
  });

  doc.y = Math.max(clientY, detailY) + 30;

  // ── Line items table ─────────────────────────────────────────────────────────
  const tableTop = doc.y;
  const colDesc  = 50;
  const colQty   = 320;
  const colPrice = 390;
  const colTotal = 470;

  doc.rect(50, tableTop, pageWidth, 28).fill(BRAND_NAVY);
  doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
  doc.text('DESCRIPTION', colDesc + 10, tableTop + 9);
  doc.text('QTY',         colQty,       tableTop + 9, { width: 50, align: 'center' });
  doc.text('UNIT PRICE',  colPrice,     tableTop + 9, { width: 70, align: 'right' });
  doc.text('TOTAL',       colTotal,     tableTop + 9, { width: 80, align: 'right' });

  let rowY = tableTop + 28;
  invoice.items.forEach((item, i) => {
    const rowHeight = 26;
    if (i % 2 === 1) doc.rect(50, rowY, pageWidth, rowHeight).fill('#f9fafb');

    doc.fillColor(GRAY_DARK).fontSize(9).font('Helvetica');
    doc.text(item.description, colDesc + 10, rowY + 8, { width: 260 });
    doc.text(String(item.quantity), colQty, rowY + 8, { width: 50, align: 'center' });
    doc.text(formatCurrency(item.unitPrice, invoice.currency), colPrice, rowY + 8, { width: 70, align: 'right' });
    doc.font('Helvetica-Bold').text(formatCurrency(item.total, invoice.currency), colTotal, rowY + 8, { width: 80, align: 'right' });
    rowY += rowHeight;
  });

  doc.moveTo(50, rowY).lineTo(50 + pageWidth, rowY).strokeColor(GRAY_LIGHT).stroke();
  doc.y = rowY + 20;

  // ── Totals box ───────────────────────────────────────────────────────────────────
  const totalsX     = 350;
  const totalsWidth = 200;
  let totalsY = doc.y;

  const totalRow = (label, value, bold = false, color = GRAY_DARK) => {
    doc.fillColor(GRAY_MEDIUM).fontSize(10).font(bold ? 'Helvetica-Bold' : 'Helvetica')
       .text(label, totalsX, totalsY, { width: 100 });
    doc.fillColor(color).fontSize(bold ? 13 : 10).font(bold ? 'Helvetica-Bold' : 'Helvetica')
       .text(value, totalsX + 100, totalsY, { width: 100, align: 'right' });
    totalsY += bold ? 24 : 18;
  };

  totalRow('Subtotal', formatCurrency(invoice.subtotal, invoice.currency));
  if (invoice.tax && invoice.tax > 0) {
    totalRow('Tax', formatCurrency(invoice.tax, invoice.currency));
  }
  doc.moveTo(totalsX, totalsY).lineTo(totalsX + totalsWidth, totalsY).strokeColor(GRAY_LIGHT).stroke();
  totalsY += 8;
  totalRow('Total Due', formatCurrency(invoice.amount, invoice.currency), true, BRAND_NAVY);

  doc.y = totalsY + 30;

  // ── Notes & Terms ───────────────────────────────────────────────────────────────
  if (invoice.notes) {
    doc.fillColor(GRAY_MEDIUM).fontSize(9).font('Helvetica-Bold').text('NOTES', 50, doc.y);
    doc.fillColor(GRAY_DARK).fontSize(9).font('Helvetica').text(invoice.notes, 50, doc.y + 14, { width: pageWidth });
    doc.moveDown(2);
  }

  if (invoice.terms) {
    doc.fillColor(GRAY_MEDIUM).fontSize(9).font('Helvetica-Bold').text('TERMS & CONDITIONS', 50, doc.y);
    doc.fillColor(GRAY_DARK).fontSize(9).font('Helvetica').text(invoice.terms, 50, doc.y + 14, { width: pageWidth });
  }

  // ── Footer ───────────────────────────────────────────────────────────────────────
  const footerY = doc.page.height - 70;
  doc.moveTo(50, footerY).lineTo(50 + pageWidth, footerY).strokeColor(GRAY_LIGHT).stroke();
  doc.fillColor(GRAY_MEDIUM).fontSize(8).font('Helvetica')
     .text('Thank you for your business.', 50, footerY + 12, { width: pageWidth, align: 'center' });
  doc.text(`SkilVaTech · ${env.CLIENT_URL || 'skilvatech.com'}`, 50, footerY + 26, { width: pageWidth, align: 'center' });
};

/**
 * Generates an invoice PDF and streams it directly to an HTTP response.
 * Use this for the download endpoint.
 */
export const streamInvoicePDF = (invoice, res) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${invoice.number}.pdf"`);
  doc.pipe(res);
  drawInvoice(doc, invoice);
  doc.end();
};

/**
 * Generates an invoice PDF and resolves with an in-memory Buffer.
 * Use this when you need the PDF bytes for something other than an
 * HTTP response — e.g. attaching it to an email.
 */
export const generateInvoicePDFBuffer = (invoice) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    drawInvoice(doc, invoice);
    doc.end();
  });
};