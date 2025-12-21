export const requireApprovedAgent = (req, res, next) => {
  if (req.user.role !== "AGENT") return next();

  if (!req.user.agentApproved) {
    return res.status(403).json({
      message: "Agent not approved to resolve tickets"
    });
  }

  next();
};

export default requireApprovedAgent;