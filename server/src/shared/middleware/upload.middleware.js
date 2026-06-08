import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../errors/AppError.js';

// ─── Allowed file types ────────────────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES   = ['application/pdf', 'application/msword',
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_ALL         = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

// ─── Memory storage (files go to Cloudinary/S3 not disk) ─────────────────────
const storage = multer.memoryStorage();

const fileFilter = (allowed) => (req, file, cb) => {
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`File type not allowed: ${file.mimetype}`), false);
  }
};

// ─── Upload presets ───────────────────────────────────────────────────────────
export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
}).single('file');

export const uploadDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter(ALLOWED_DOC_TYPES),
}).single('file');

export const uploadAny = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter(ALLOWED_ALL),
}).single('file');

// ─── Wrap multer to convert errors to AppErrors ────────────────────────────────
export const handleUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return next(new BadRequestError('File too large'));
      return next(new BadRequestError(err.message));
    }
    next(err);
  });
};