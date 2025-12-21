import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import { getIO } from "../socket.js";

/* =========================
   CREATE TICKET (CUSTOMER)
========================= */
export const createTicket = async (req, res) => {
  try {
    const { subject, description = "", priority = "LOW" } = req.body;

    // Role guard (non-negotiable)
    if (req.user.role !== "CUSTOMER") {
      return res
        .status(403)
        .json({ message: "Only customers can create tickets" });
    }

    // Validation
    if (!subject || !subject.trim()) {
      return res
        .status(400)
        .json({ message: "Ticket subject is required" });
    }

    // Create ticket
    const ticket = await Ticket.create({
      customerId: req.user.id,
      subject: subject.trim(),
      description: description.trim(),
      priority,
      status: "OPEN"
    });

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket
    });

  } catch (err) {
    console.error("Create Ticket Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to create ticket" });
  }
};

/* =========================
   ASSIGN TICKET (ADMIN)
========================= */
export const assignTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { agentId } = req.body;

  // 1️⃣ Role check
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admin can assign tickets" });
  }

  // 2️⃣ Validate agent
  const agent = await User.findById(agentId);
  if (
    !agent ||
    agent.role !== "AGENT" ||
    !agent.agentStatus.approved
  ) {
    return res.status(400).json({ message: "Invalid or unapproved agent" });
  }

  // 3️⃣ Validate ticket
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (ticket.status !== "OPEN") {
    return res.status(400).json({ message: "Ticket already assigned" });
  }

  // 4️⃣ Assign
  ticket.agentId = agentId;
  ticket.status = "ASSIGNED";
  await ticket.save();

  res.json({
    message: "Ticket assigned successfully",
    ticket
  });
};

/* =========================
   UPDATE TICKET STATUS
========================= */
export const updateTicketStatus = async (req, res) => {
  console.log("Update Ticket Status Request Body:", req.body);
  const { ticketId, status } = req.body;
  const { role, id } = req.user;

  const allowedStatus = ["RESOLVED", "CLOSED"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  // 🔐 Role rules
  if (status === "RESOLVED" && role !== "AGENT" && role !== "ADMIN") {
    return res.status(403).json({ message: "Only agent/admin can resolve tickets" });
  }

  if (status === "CLOSED" && role !== "CUSTOMER" && role !== "ADMIN") {
    return res.status(403).json({ message: "Only customer/admin can close tickets" });
  }

  ticket.status = status;

  if (status === "RESOLVED") ticket.resolvedAt = new Date();
  if (status === "CLOSED") ticket.closedAt = new Date();

  await ticket.save();

  const io = getIO();
  io.to(ticketId).emit("ticket_status_updated", {
    ticketId,
    status: ticket.status
  });

  res.json({
    message: `Ticket ${status.toLowerCase()}`,
    ticket
  });
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


/* =========================
   ACCEPT TICKET (AGENT)
========================= */

export const acceptTicket = async (req, res) => {
  const { ticketId } = req.params;
  const agentId = req.user.id;

  // 1️⃣ Role check
  if (req.user.role !== "AGENT") {
    return res.status(403).json({ message: "Only agents can accept tickets" });
  }

  // 2️⃣ Approval check
  const agent = await User.findById(agentId);
  if (!agent.agentStatus.approved) {
    return res.status(403).json({ message: "Agent not approved" });
  }

  // 3️⃣ Ticket validation
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (ticket.status === "CLOSED") {
    return res.status(400).json({ message: "Ticket is closed" });
  }

  // 4️⃣ If already assigned to someone else → block
  if (
    ticket.agentId &&
    ticket.agentId.toString() !== agentId
  ) {
    return res.status(403).json({ message: "Ticket assigned to another agent" });
  }

  // 5️⃣ Accept ticket
  ticket.agentId = agentId;
  ticket.status = "IN_PROGRESS";
  await ticket.save();

  res.json({
    message: "Ticket accepted",
    ticket
  });
};
