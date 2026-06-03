// permission.controller.js
import { listPermissions } from './permission.service.js';
import { sendSuccess } from '../../shared/utils/response.utils.js';

// GET /api/v1/permissions
export const getPermissions = async (req, res, next) => {
  try {
    const data = await listPermissions();
    sendSuccess(res, data);
  } catch (err) { next(err); }
};