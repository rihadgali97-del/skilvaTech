// uploads/upload.controller.js
import { uploadToCloudinary } from '../../shared/services/storage.service.js';
import { sendSuccess } from '../../shared/utils/response.utils.js';
import { BadRequestError } from '../../shared/errors/AppError.js';

// POST /api/v1/uploads/image
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) throw new BadRequestError('No file provided');

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.query.folder || 'document',
      { transformation: [{ quality: 'auto', fetch_format: 'auto' }] }
    );

    sendSuccess(res, {
      url:      result.secure_url,
      publicId: result.public_id,
      format:   result.format,
      size:     result.bytes,
      width:    result.width,
      height:   result.height,
    }, 'File uploaded successfully');
  } catch (err) { next(err); }
};

// POST /api/v1/uploads/document
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) throw new BadRequestError('No file provided');

    const result = await uploadToCloudinary(req.file.buffer, 'document');

    sendSuccess(res, {
      url:      result.secure_url,
      publicId: result.public_id,
      format:   result.format,
      size:     result.bytes,
    }, 'Document uploaded successfully');
  } catch (err) { next(err); }
};