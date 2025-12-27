import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/* =========================
   CUSTOMER DASHBOARD
========================= */
export const customerDashboard = async (req, res) => {
  try {
    const customerId = mongoose.Types.ObjectId.createFromHexString(
      req.user.id
    );

    const stats = await Ticket.aggregate([
      { $match: { customerId } },
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
      const key = s._id.toLowerCase();
      if (key in result) {
        result[key] = s.count;
        result.total += s.count;
      }
    });


    res.json(result);
  } catch (err) {
    console.error("Customer dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};


/* =========================
   AGENT DASHBOARD
========================= */
export const agentDashboard = async (req, res) => {
  try {
    const agentId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    const statsRaw = await Ticket.aggregate([
      { $match: { agentId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total: 0,
      open: 0,
      assigned: 0,
      resolved: 0,
      closed: 0
    };

    statsRaw.forEach(s => {
      const key = s._id.toLowerCase();
      if (key in stats) {
        stats[key] = s.count;
        stats.total += s.count;
      }
    });

    res.json({ stats });
  } catch (err) {
    console.error("Agent dashboard error:", err);
    res.status(500).json({ message: "Failed to load agent dashboard" });
  }
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

    const stats = {
      total: 0,
      open: 0,
      assigned: 0,
      resolved: 0,
      closed: 0
    };

    ticketStatsRaw.forEach(t => {
      const key = t._id.toLowerCase();
      if (key in stats) {
        stats[key] = t.count;
        stats.total += t.count;
      }
    });

    /* =========================
       AGENT COUNTS (EXPLICIT)
    ========================= */
    const [totalAgents, approvedAgents, pendingAgents] = await Promise.all([
      User.countDocuments({ role: "AGENT" }),
      User.countDocuments({
        role: "AGENT",
        "agentStatus.approved": true
      }),
      User.countDocuments({
        role: "AGENT",
        "agentStatus.approved": false
      })
    ]);

    /* =========================
       FINAL RESPONSE
    ========================= */
    res.json({
      stats,
      meta: {
        agents: {
          total: totalAgents,
          approved: approvedAgents,
          pending: pendingAgents
        },
      }
    });

  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Failed to load admin dashboard" });
  }
};



