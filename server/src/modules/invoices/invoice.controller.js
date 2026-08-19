import * as invoiceService from './invoice.service.js';
import { streamInvoicePDF, generateInvoicePDFBuffer } from '../../shared/services/pdf.service.js';
import { sendEmail } from '../../shared/services/email.service.js';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../../shared/utils/response.utils.js';
import logger from '../../config/logger.js';

export const listInvoices = async (req, res, next) => {
  try { sendPaginated(res, await invoiceService.listInvoices(req.query)); }
  catch (err) { next(err); }
};

export const getInvoiceById = async (req, res, next) => {
  try { sendSuccess(res, { invoice: await invoiceService.getInvoiceById(req.params.id) }); }
  catch (err) { next(err); }
};

export const createInvoice = async (req, res, next) => {
  try { sendCreated(res, { invoice: await invoiceService.createInvoice(req.body) }, 'Invoice created as draft'); }
  catch (err) { next(err); }
};

export const updateInvoice = async (req, res, next) => {
  try { sendSuccess(res, { invoice: await invoiceService.updateInvoice(req.params.id, req.body) }, 'Invoice updated'); }
  catch (err) { next(err); }
};

// POST /invoices/:id/send — transitions status to "sent" and emails the client a PDF copy.
// Email failure does NOT roll back the status change — the invoice is already sent
// from a business perspective; the email is a courtesy notification on top of that.
export const sendInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.sendInvoice(req.params.id);

    try {
      const pdfBuffer = await generateInvoicePDFBuffer(invoice);
      await sendEmail({
        to:      invoice.client.email,
        subject: `Invoice ${invoice.number} from SkilVaTech`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <div style="background:#0d1f2d;padding:24px;text-align:center;">
              <h2 style="color:#00d4d4;margin:0;">SkilVaTech</h2>
            </div>
            <div style="padding:24px;background:#fff;">
              <h3>Invoice ${invoice.number}</h3>
              <p>Hi ${invoice.client.name},</p>
              <p>Please find attached your invoice for <strong>${invoice.currency} ${invoice.amount}</strong>,
                 due ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'upon receipt'}.</p>
              <p style="color:#888;font-size:12px;margin-top:24px;">Thank you for your business.</p>
            </div>
          </div>
        `,
        attachments: [{ filename: `${invoice.number}.pdf`, content: pdfBuffer }],
      });
    } catch (emailErr) {
      logger.warn('Invoice email failed to send', { invoiceId: invoice.id, error: emailErr.message });
    }

    sendSuccess(res, { invoice }, 'Invoice sent to client');
  } catch (err) { next(err); }
};

export const markAsPaid = async (req, res, next) => {
  try { sendSuccess(res, { invoice: await invoiceService.markAsPaid(req.params.id) }, 'Invoice marked as paid'); }
  catch (err) { next(err); }
};

export const cancelInvoice = async (req, res, next) => {
  try { sendSuccess(res, { invoice: await invoiceService.cancelInvoice(req.params.id) }, 'Invoice cancelled'); }
  catch (err) { next(err); }
};

export const deleteInvoice = async (req, res, next) => {
  try { await invoiceService.deleteInvoice(req.params.id); sendNoContent(res); }
  catch (err) { next(err); }
};

export const downloadInvoicePDF = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    streamInvoicePDF(invoice, res);
  } catch (err) { next(err); }
};

export const getStats = async (req, res, next) => {
  try { sendSuccess(res, { stats: await invoiceService.getStats() }); }
  catch (err) { next(err); }
};