import Message from "../models/Message.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import { getIO } from "../socket.js";

/* =========================
   SEND MESSAGE
========================= */
export const sendMessage = async (req, res) => {
  const { ticketId, content } = req.body;
  const { id, role } = req.user;

  if (!content?.trim()) {
    return res.status(400).json({ message: "Message cannot be empty" });
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  // Block chat on closed tickets
  if (ticket.status === "CLOSED") {
    return res.status(403).json({ message: "Ticket is closed" });
  }

  // Permission checks
  if (role === "CUSTOMER" && ticket.customerId.toString() !== id) {
    return res.status(403).json({ message: "Unauthorized ticket access" });
  }

  if (role === "AGENT") {
    const agent = await User.findById(id);
    if (!agent.agentStatus.approved) {
      return res.status(403).json({ message: "Agent not approved" });
    }
    if (ticket.agentId?.toString() !== id) {
      return res.status(403).json({ message: "Ticket not assigned to you" });
    }
  }

  const message = await Message.create({
    ticketId,
    senderId: id,
    senderRole: role,
    content
  });

  // populate sender so frontend shape is consistent
  const populatedMessage = await message.populate(
    "senderId",
    "name role"
  );

  const io = getIO();
  io.to(ticketId).emit("new_message", populatedMessage);

  res.status(201).json(populatedMessage);
};

/* =========================
   GET CHAT HISTORY
========================= */
export const getMessagesByTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { id, role } = req.user;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  // Access validation
  if (
    role === "CUSTOMER" &&
    ticket.customerId.toString() !== id
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (
    role === "AGENT" &&
    ticket.agentId?.toString() !== id
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const messages = await Message.find({ ticketId })
    .sort({ createdAt: 1 })
    .populate("senderId", "name role");

  res.json(messages);
};
