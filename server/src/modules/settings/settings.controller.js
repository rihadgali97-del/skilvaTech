import * as settingsService from './settings.service.js';
import { sendSuccess, sendNoContent } from '../../shared/utils/response.utils.js';
import { sendEmail } from '../../shared/services/email.service.js';

// GET /api/v1/settings — all settings grouped (admin only)
export const getAllSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.getAllSettings();
    sendSuccess(res, { settings });
  } catch (err) { next(err); }
};

// GET /api/v1/settings/public — public settings (no auth)
export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.getPublicSettings();
    sendSuccess(res, { settings });
  } catch (err) { next(err); }
};

// PATCH /api/v1/settings/:key — update single setting
export const updateSetting = async (req, res, next) => {
  try {
    const { value } = req.body;
    const setting = await settingsService.updateSetting(req.params.key, value);
    sendSuccess(res, { setting }, 'Setting updated');
  } catch (err) { next(err); }
};

// PATCH /api/v1/settings — bulk update
export const updateManySettings = async (req, res, next) => {
  try {
    const { updates } = req.body; // [{ key, value }]
    const results = await settingsService.updateManySettings(updates);
    sendSuccess(res, { updated: results.length }, `${results.length} settings updated`);
  } catch (err) { next(err); }
};

// POST /api/v1/settings/reset/:group — reset group to defaults
export const resetGroup = async (req, res, next) => {
  try {
    const result = await settingsService.resetGroup(req.params.group);
    sendSuccess(res, result, `${result.group} settings reset to defaults`);
  } catch (err) { next(err); }
};

// GET /api/v1/settings/system — system info
export const getSystemInfo = async (req, res, next) => {
  try {
    const info = await settingsService.getSystemInfo();
    sendSuccess(res, { system: info });
  } catch (err) { next(err); }
};

// POST /api/v1/settings/test-email — send a test email
export const sendTestEmail = async (req, res, next) => {
  try {
    const { to } = req.body;
    await sendEmail({
      to:      to || req.user.email,
      subject: 'SkilVaTech — Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background:#0d1f2d;padding:24px;text-align:center;">
            <h2 style="color:#00d4d4;margin:0;">SkilVaTech</h2>
          </div>
          <div style="padding:24px;background:#fff;">
            <h3>✅ Email is working!</h3>
            <p>This is a test email sent from your SkilVaTech settings page.</p>
            <p style="color:#888;font-size:12px;">Sent at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });
    sendSuccess(res, null, `Test email sent to ${to || req.user.email}`);
  } catch (err) { next(err); }
};