import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
  customerDashboard,
  agentDashboard,
  adminDashboard
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
  "/customer",
  authMiddleware,
  allowRoles("CUSTOMER"),
  customerDashboard
);

router.get(
  "/agent",
  authMiddleware,
  allowRoles("AGENT"),
  agentDashboard
);

router.get(
  "/admin",
  authMiddleware,
  allowRoles("ADMIN"),
  adminDashboard
);

export default router;
