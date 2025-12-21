import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
  createAgent,
  getAllAgents,
  getPendingAgents,
  approveAgent,
  rejectAgent
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post(
  "/agents/create",
  authMiddleware,
  allowRoles("ADMIN"),
  createAgent
);

router.get(
  "/agents",
  authMiddleware,
  allowRoles("ADMIN"),
  getAllAgents
);

router.get(
  "/agents/pending",
  authMiddleware,
  allowRoles("ADMIN"),
  getPendingAgents
);

router.put(
  "/agents/:id/approve",
  authMiddleware,
  allowRoles("ADMIN"),
  approveAgent
);

router.put(
  "/agents/:id/reject",
  authMiddleware,
  allowRoles("ADMIN"),
  rejectAgent
);

export default router;
