import { Router } from 'express';
import * as ticketController from './ticket.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requirePermission } from '../../shared/middleware/permissions.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createTicketSchema, updateTicketSchema, listTicketsSchema } from './ticket.validation.js';

const router = Router();
router.use(authenticate);

router.get('/',     requirePermission('tickets:read'),   validate(listTicketsSchema, 'query'), ticketController.listTickets);
router.get('/:id',  requirePermission('tickets:read'),   ticketController.getTicketById);
router.post('/',    requirePermission('tickets:create'), validate(createTicketSchema), ticketController.createTicket);
router.patch('/:id', requirePermission('tickets:update'), validate(updateTicketSchema), ticketController.updateTicket);
router.delete('/:id', requirePermission('tickets:delete'), ticketController.deleteTicket);

export default router;