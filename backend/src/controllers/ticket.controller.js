import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

/* =========================
   CREATE TICKET (CUSTOMER)
========================= */
export const createTicket = async (req, res) => {
  const { priority = "LOW" } = req.body;

  const ticket = await Ticket.create({
    customerId: req.user.id,
    priority
  });

  res.status(201).json(ticket);
};

/* =========================
   ASSIGN TICKET (ADMIN)
========================= */
export const assignTicket = async (req, res) => {
  const { ticketId, agentId } = req.body;

  const agent = await User.findById(agentId);

  if (!agent || agent.role !== "AGENT" || !agent.agentStatus.approved) {
    return res.status(400).json({
      message: "Agent is not approved or invalid"
    });
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  ticket.agentId = agentId;
  ticket.status = "ASSIGNED";
  ticket.assignedAt = new Date();

  await ticket.save();

  agent.activeTicketCount += 1;
  await agent.save();

  res.json({ message: "Ticket assigned successfully" });
};

/* =========================
   UPDATE TICKET STATUS
========================= */
export const updateTicketStatus = async (req, res) => {
  const { ticketId, status } = req.body;

  const allowedStatus = ["RESOLVED", "CLOSED"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  ticket.status = status;

  if (status === "RESOLVED") ticket.resolvedAt = new Date();
  if (status === "CLOSED") ticket.closedAt = new Date();

  await ticket.save();

  res.json({ message: `Ticket ${status.toLowerCase()}` });
};

/* =========================
   FETCH TICKETS (ROLE BASED)
========================= */
export const getTickets = async (req, res) => {
  const { role, id } = req.user;

  let query = {};

  if (role === "CUSTOMER") {
    query.customerId = id;
  }

  if (role === "AGENT") {
    query.agentId = id;
  }

  const tickets = await Ticket.find(query)
    .sort({ createdAt: -1 })
    .populate("customerId", "name email")
    .populate("agentId", "name email");

  res.json(tickets);
};
