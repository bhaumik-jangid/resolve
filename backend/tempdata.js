import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./src/models/User.js";
import Ticket from "./src/models/Ticket.js";
import Message from "./src/models/Message.js";
import AgentRequest from "./src/models/AgentRequest.js";
import AuditLog from "./src/models/AuditLog.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const admin = await User.create({
  name: "Admin",
  email: "admin@system.com",
  passwordHash: "hashed-password",
  role: "ADMIN",
  authProvider: "LOCAL"
});

const customer = await User.create({
  name: "Test Customer",
  email: "customer@test.com",
  passwordHash: "hashed-password",
  role: "CUSTOMER"
});

const ticket = await Ticket.create({
  customerId: customer._id,
  priority: "MEDIUM"
});

await Message.create({
  ticketId: ticket._id,
  senderId: admin._id,
  senderRole: "ADMIN",
  content: "Admin test message"
});

await AuditLog.create({
  action: "SYSTEM_INIT",
  performedBy: admin._id,
  targetType: "SYSTEM"
});

console.log("Seed data inserted");
process.exit();
