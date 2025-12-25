import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

/* =========================
   CUSTOMER DASHBOARD
========================= */
export const customerDashboard = async (req, res) => {
  const customerId = req.user.id;

  const stats = await Ticket.aggregate([
    { $match: { customerId: req.user._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    total: 0,
    open: 0,
    assigned: 0,
    resolved: 0,
    closed: 0
  };

  stats.forEach(s => {
    result[s._id.toLowerCase()] = s.count;
    result.total += s.count;
  });

  res.json(result);
};


/* =========================
   AGENT DASHBOARD
========================= */
export const agentDashboard = async (req, res) => {
  const agentId = req.user.id;

  const stats = await Ticket.aggregate([
    { $match: { agentId: req.user._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    assigned: 0,
    resolved: 0,
    closed: 0
  };

  stats.forEach(s => {
    result[s._id.toLowerCase()] = s.count;
  });

  res.json(result);
};


/* =========================
   ADMIN DASHBOARD
========================= */
export const adminDashboard = async (req, res) => {
  try {
    /* =========================
       TICKET STATS
    ========================= */
    const ticketStatsRaw = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const ticketStats = {
      total: 0,
      open: 0,
      assigned: 0,
      resolved: 0,
      closed: 0
    };

    ticketStatsRaw.forEach(t => {
      const key = t._id.toLowerCase();
      ticketStats[key] = t.count;
      ticketStats.total += t.count;
    });

    /* =========================
       AGENT COUNTS
    ========================= */
    const [totalAgents, pendingAgents] = await Promise.all([
      User.countDocuments({ role: "AGENT" }),
      User.countDocuments({
        role: "AGENT",
        "agentStatus.approved": false
      })
    ]);

    /* =========================
       AGENT LIST (LIGHTWEIGHT)
    ========================= */
    const agents = await User.find({ role: "AGENT" })
      .select("name email agentStatus activeTicketCount createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const agentsList = agents.map(agent => ({
      id: agent._id,
      name: agent.name,
      email: agent.email,
      approved: agent.agentStatus?.approved ?? false,
      activeTicketCount: agent.activeTicketCount || 0,
      createdAt: agent.createdAt
    }));

    /* =========================
       FINAL RESPONSE
    ========================= */
    res.json({
      tickets: ticketStats,
      agents: {
        total: totalAgents,
        pending: pendingAgents
      },
      agentsList
    });

  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Failed to load admin dashboard" });
  }
};

