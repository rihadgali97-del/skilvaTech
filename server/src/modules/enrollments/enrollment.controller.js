// enrollment.controller.js
import * as enrollmentService from './enrollment.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../../shared/utils/response.utils.js';

export const listEnrollments = async (req, res, next) => {
  try { sendPaginated(res, await enrollmentService.listEnrollments(req.query)); }
  catch(e){ next(e); }
};

export const enrollStudent = async (req, res, next) => {
  try { sendCreated(res, { enrollment: await enrollmentService.enrollStudent(req.body) }, 'Enrolled successfully'); }
  catch(e){ next(e); }
};

export const updateProgress = async (req, res, next) => {
  try { sendSuccess(res, { enrollment: await enrollmentService.updateProgress(req.params.id, req.body) }, 'Progress updated'); }
  catch(e){ next(e); }
};

export const cancelEnrollment = async (req, res, next) => {
  try { sendSuccess(res, { enrollment: await enrollmentService.cancelEnrollment(req.params.id) }, 'Enrollment cancelled'); }
  catch(e){ next(e); }
};