import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import logger from '../../config/logger.js';

// ─── Create transporter ───────────────────────────────────────────────────────
const createTransporter = () => {
  if (!env.SMTP_HOST) {
    logger.warn('SMTP not configured — emails will not be sent');
    return null;
  }

  return nodemailer.createTransporter({
    host:   env.SMTP_HOST,
    port:   env.SMTP_PORT || 587,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
};

// ─── Send email ───────────────────────────────────────────────────────────────
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  if (!transporter) {
    logger.info(`[EMAIL SKIPPED] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from:    `"SkilVaTech" <${env.FROM_EMAIL || 'noreply@skilvatech.com'}>`,
      to, subject, html, text,
    });
    logger.info(`Email sent: ${info.messageId} to ${to}`);
    return info;
  } catch (error) {
    logger.error('Email send failed', { error: error.message, to, subject });
    throw error;
  }
};

// ─── Email templates ──────────────────────────────────────────────────────────
export const sendWelcomeEmail = (user) =>
  sendEmail({
    to:      user.email,
    subject: 'Welcome to SkilVaTech!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d1f2d; padding: 32px; text-align: center;">
          <h1 style="color: #00d4d4; margin: 0;">SkilVaTech</h1>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2>Welcome, ${user.firstName}!</h2>
          <p>Your account has been created successfully.</p>
          <p>You can now log in and explore the platform.</p>
          <a href="${env.CLIENT_URL}/login"
             style="display: inline-block; padding: 12px 24px; background: #00d4d4;
                    color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
            Sign In
          </a>
        </div>
        <div style="padding: 16px; text-align: center; color: #888; font-size: 12px;">
          © ${new Date().getFullYear()} SkilVaTech. All rights reserved.
        </div>
      </div>
    `,
  });

export const sendPasswordResetEmail = (user, resetToken) =>
  sendEmail({
    to:      user.email,
    subject: 'Reset Your Password — SkilVaTech',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d1f2d; padding: 32px; text-align: center;">
          <h1 style="color: #00d4d4; margin: 0;">SkilVaTech</h1>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2>Password Reset</h2>
          <p>Hi ${user.firstName}, we received a request to reset your password.</p>
          <p>Click the button below. This link expires in 1 hour.</p>
          <a href="${env.CLIENT_URL}/reset-password?token=${resetToken}"
             style="display: inline-block; padding: 12px 24px; background: #00d4d4;
                    color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
            Reset Password
          </a>
          <p style="margin-top: 24px; color: #888; font-size: 12px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });

export const sendTicketCreatedEmail = (ticket, assignee) => {
  if (!assignee?.email) return;
  return sendEmail({
    to:      assignee.email,
    subject: `New Ticket Assigned: ${ticket.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d1f2d; padding: 32px; text-align: center;">
          <h1 style="color: #00d4d4; margin: 0;">SkilVaTech</h1>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2>New Ticket Assigned to You</h2>
          <p><strong>Title:</strong> ${ticket.title}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          <p><strong>Type:</strong> ${ticket.type}</p>
          <a href="${env.CLIENT_URL}/dashboard/tickets"
             style="display: inline-block; padding: 12px 24px; background: #00d4d4;
                    color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
            View Ticket
          </a>
        </div>
      </div>
    `,
  });
};