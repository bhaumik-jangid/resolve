import User from "../models/User.js";

const checkAgentApproval = async (req, res, next) => {
  const { id, role } = req.user;

  // Customers & Admins are always allowed
  if (role === "CUSTOMER" || role === "ADMIN") {
    return next();
  }

  // Agents must be approved
  if (role === "AGENT") {
    const agent = await User.findById(id);

    if (!agent || !agent.agentStatus?.approved) {
      return res.status(403).json({
        message: "Agent not approved by admin"
      });
    }
  }

  next();
};

export default checkAgentApproval;
