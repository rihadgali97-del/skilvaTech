// auditlog.controller.js
import { listAuditLogs } from './auditlog.service.js';
import { sendPaginated } from '../../shared/utils/response.utils.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const result = await listAuditLogs(req.query);
    sendPaginated(res, result);
  } catch (err) { next(err); }
};