import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AgentRequest from "../models/AgentRequest.js";

/* =========================
   CREATE AGENT (ADMIN ONLY)
========================= */
export const createAgent = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Agent already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const agent = await User.create({
    name,
    email,
    passwordHash: hash,
    role: "AGENT",
    authProvider: "LOCAL",
    agentStatus: { approved: false }
  });

  await AgentRequest.create({
    agentId: agent._id,
    status: "PENDING"
  });

  res.status(201).json({
    message: "Agent created and pending approval"
  });
};

/* =========================
   LIST ALL AGENTS
========================= */
export const getAllAgents = async (req, res) => {
  const agents = await User.find({ role: "AGENT" })
    .select("name email agentStatus createdAt");

  res.json(agents);
};

/* =========================
   PENDING AGENT REQUESTS
========================= */
export const getPendingAgents = async (req, res) => {
  const pending = await AgentRequest.find({ status: "PENDING" })
    .populate("agentId", "name email createdAt");

  res.json(pending);
};

/* =========================
   APPROVE AGENT
========================= */
export const approveAgent = async (req, res) => {
  const { id } = req.params;

  const agent = await User.findById(id);
  if (!agent || agent.role !== "AGENT") {
    return res.status(404).json({ message: "Agent not found" });
  }

  agent.agentStatus = {
    approved: true,
    approvedBy: req.user.id,
    approvedAt: new Date()
  };
  await agent.save();

  await AgentRequest.findOneAndUpdate(
    { agentId: id },
    {
      status: "APPROVED",
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    }
  );

  res.json({ message: "Agent approved" });
};

/* =========================
   REJECT AGENT
========================= */
export const rejectAgent = async (req, res) => {
  const { id } = req.params;

  await AgentRequest.findOneAndUpdate(
    { agentId: id },
    {
      status: "REJECTED",
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    }
  );

  res.json({ message: "Agent rejected" });
};