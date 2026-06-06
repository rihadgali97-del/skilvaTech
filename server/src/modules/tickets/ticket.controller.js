// ticket.controller.js
import * as ticketService from './ticket.service.js';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../../shared/utils/response.utils.js';

export const listTickets   = async (req, res, next) => { try { sendPaginated(res, await ticketService.listTickets(req.query));                                      } catch(e){ next(e); }};
export const getTicketById = async (req, res, next) => { try { sendSuccess(res, { ticket: await ticketService.getTicketById(req.params.id) });                       } catch(e){ next(e); }};
export const createTicket  = async (req, res, next) => { try { sendCreated(res, { ticket: await ticketService.createTicket(req.body, req.user.id) }, 'Ticket created'); } catch(e){ next(e); }};
export const updateTicket  = async (req, res, next) => { try { sendSuccess(res, { ticket: await ticketService.updateTicket(req.params.id, req.body) }, 'Updated');    } catch(e){ next(e); }};
export const deleteTicket  = async (req, res, next) => { try { await ticketService.deleteTicket(req.params.id); sendNoContent(res);                                  } catch(e){ next(e); }};