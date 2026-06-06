// client.controller.js
import * as clientService from './client.service.js';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../../shared/utils/response.utils.js';

export const listClients   = async (req, res, next) => { try { sendPaginated(res, await clientService.listClients(req.query));                                  } catch(e){ next(e); }};
export const getClientById = async (req, res, next) => { try { sendSuccess(res, { client: await clientService.getClientById(req.params.id) });                   } catch(e){ next(e); }};
export const createClient  = async (req, res, next) => { try { sendCreated(res, { client: await clientService.createClient(req.body) }, 'Client created');        } catch(e){ next(e); }};
export const updateClient  = async (req, res, next) => { try { sendSuccess(res, { client: await clientService.updateClient(req.params.id, req.body) }, 'Updated');} catch(e){ next(e); }};
export const deleteClient  = async (req, res, next) => { try { await clientService.deleteClient(req.params.id); sendNoContent(res);                              } catch(e){ next(e); }};