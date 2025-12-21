import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import requireApprovedAgent from "../middlewares/requireApprovedAgent.js";

import {
  createTicket,
  assignTicket,
  updateTicketStatus,
  getTickets
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
router.post(
  "/assign",
  authMiddleware,
  allowRoles("ADMIN"),
  assignTicket
);

/* Agent/Admin update status */
router.put(
  "/status",
  authMiddleware,
  allowRoles("AGENT", "ADMIN"),
  updateTicketStatus
);

/* Fetch tickets */
router.get(
  "/",
  authMiddleware,
  getTickets
);

export default router;
