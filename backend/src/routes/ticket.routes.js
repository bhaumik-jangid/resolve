import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
  createTicket,
  assignTicket,
  updateTicketStatus,
  getTickets, 
  acceptTicketByAgent

} from "../controllers/ticket.controller.js";

const router = express.Router();

/* Customer creates ticket */
router.post(
  "/create",
  authMiddleware,
  allowRoles("CUSTOMER"),
  createTicket
);

/* Admin assigns ticket */
router.patch(
  "/:ticketId/assign",
  authMiddleware,
  assignTicket
);


/* Agent/Admin update status */
router.put(
  "/status",
  authMiddleware,
  allowRoles("AGENT", "ADMIN", "CUSTOMER"),
  updateTicketStatus
);

/* Fetch tickets */
router.get(
  "/",
  authMiddleware,
  getTickets
);

/* agent accepts ticket */
router.patch(
  "/:ticketId/accept",
  authMiddleware,
  acceptTicketByAgent
);

export default router;
