import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env.js';
import { BadRequestError } from '../errors/AppError.js';

// ─── Configure Cloudinary ─────────────────────────────────────────────────────
if (env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key:    env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure:     true,
  });
}

// ─── Folder structure ─────────────────────────────────────────────────────────
// skilvatech/users/avatars
// skilvatech/courses/thumbnails
// skilvatech/services/images
// skilvatech/documents
const FOLDERS = {
  avatar:    'skilvatech/users/avatars',
  course:    'skilvatech/courses',
  service:   'skilvatech/services',
  project:   'skilvatech/projects',
  ticket:    'skilvatech/tickets',
  document:  'skilvatech/documents',
  invoice:   'skilvatech/invoices',
};

// ─── Upload a file buffer to Cloudinary ──────────────────────────────────────
export const uploadToCloudinary = (buffer, folder = 'document', options = {}) => {
  if (!env.CLOUDINARY_CLOUD_NAME) {
    throw new BadRequestError('Cloudinary not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: FOLDERS[folder] || FOLDERS.document,
      resource_type: 'auto',
      ...options,
    };

    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });
};

// ─── Delete a file from Cloudinary ───────────────────────────────────────────
export const deleteFromCloudinary = async (publicId) => {
  if (!env.CLOUDINARY_CLOUD_NAME || !publicId) return;
  return cloudinary.uploader.destroy(publicId);
};

// ─── Extract public_id from Cloudinary URL ────────────────────────────────────
export const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1].split('.')[0];
  const folder   = parts.slice(-3, -1).join('/');
  return `${folder}/${filename}`;
};