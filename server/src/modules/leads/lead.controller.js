// lead.controller.js
import * as leadService from './lead.service.js';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../../shared/utils/response.utils.js';

export const listLeads   = async (req, res, next) => { try { sendPaginated(res, await leadService.listLeads(req.query));                               } catch(e){ next(e); }};
export const getLeadById = async (req, res, next) => { try { sendSuccess(res, { lead: await leadService.getLeadById(req.params.id) });                  } catch(e){ next(e); }};
export const createLead  = async (req, res, next) => { try { sendCreated(res, { lead: await leadService.createLead(req.body) }, 'Lead created');        } catch(e){ next(e); }};
export const updateLead  = async (req, res, next) => { try { sendSuccess(res, { lead: await leadService.updateLead(req.params.id, req.body) }, 'Updated'); } catch(e){ next(e); }};
export const deleteLead  = async (req, res, next) => { try { await leadService.deleteLead(req.params.id); sendNoContent(res);                           } catch(e){ next(e); }};