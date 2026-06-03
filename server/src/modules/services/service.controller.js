import * as serviceService from './service.service.js';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../../shared/utils/response.utils.js';

export const listServices    = async (req, res, next) => { try { sendPaginated(res, await serviceService.listServices(req.query));                              } catch(e){ next(e); }};
export const getServiceById  = async (req, res, next) => { try { sendSuccess(res, { service: await serviceService.getServiceById(req.params.id) });             } catch(e){ next(e); }};
export const createService   = async (req, res, next) => { try { sendCreated(res, { service: await serviceService.createService(req.body) }, 'Service created'); } catch(e){ next(e); }};
export const updateService   = async (req, res, next) => { try { sendSuccess(res, { service: await serviceService.updateService(req.params.id, req.body) });    } catch(e){ next(e); }};
export const deleteService   = async (req, res, next) => { try { await serviceService.deleteService(req.params.id); sendNoContent(res);                         } catch(e){ next(e); }};