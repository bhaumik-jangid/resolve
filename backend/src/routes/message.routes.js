import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getMessagesByTicket
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/:ticketId", authMiddleware, getMessagesByTicket);

export default router;
