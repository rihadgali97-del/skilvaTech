import { Router } from 'express';
import * as uploadController from './upload.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { uploadImage, uploadDocument, handleUpload } from '../../shared/middleware/upload.middleware.js';

const router = Router();
router.use(authenticate);

// POST /api/v1/uploads/image?folder=avatar|course|service
router.post('/image',    handleUpload(uploadImage),    uploadController.uploadImage);

// POST /api/v1/uploads/document
router.post('/document', handleUpload(uploadDocument), uploadController.uploadDocument);

export default router;