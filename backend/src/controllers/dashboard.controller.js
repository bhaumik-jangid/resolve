import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

/* =========================
   CUSTOMER DASHBOARD
========================= */
export const customerDashboard = async (req, res) => {
  const customerId = req.user.id;

  const tickets = await Ticket.find({ customerId });

  res.json({
    total: tickets.length,
    open: tickets.filter(t => t.status === "OPEN").length,
    assigned: tickets.filter(t => t.status === "ASSIGNED").length,
    closed: tickets.filter(t => t.status === "CLOSED").length
  });
};

/* =========================
   AGENT DASHBOARD
========================= */
export const agentDashboard = async (req, res) => {
  const agentId = req.user.id;

  const tickets = await Ticket.find({ agentId });

  res.json({
    assigned: tickets.length,
    open: tickets.filter(t => t.status === "ASSIGNED").length,
    resolved: tickets.filter(t => t.status === "RESOLVED").length
  });
};

/* =========================
   ADMIN DASHBOARD
========================= */
export const adminDashboard = async (req, res) => {
  const totalTickets = await Ticket.countDocuments();
  const openTickets = await Ticket.countDocuments({ status: "OPEN" });
  const closedTickets = await Ticket.countDocuments({ status: "CLOSED" });

  const totalAgents = await User.countDocuments({ role: "AGENT" });
  const pendingAgents = await User.countDocuments({
    role: "AGENT",
    "agentStatus.approved": false
  });

  res.json({
    tickets: {
      total: totalTickets,
      open: openTickets,
      closed: closedTickets
    },
    agents: {
      total: totalAgents,
      pending: pendingAgents
    }
  });
};
