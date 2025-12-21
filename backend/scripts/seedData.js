import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../src/models/User.js";
import Ticket from "../src/models/Ticket.js";
import Message from "../src/models/Message.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const runSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // ⚠️ Clean old data
    await User.deleteMany();
    await Ticket.deleteMany();
    await Message.deleteMany();

    console.log("Old data cleared");

    const passwordHash = await bcrypt.hash("password123", 10);

    // =====================
    // USERS
    // =====================

    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      passwordHash,
      role: "ADMIN",
      authProvider: "LOCAL"
    });

    const agent = await User.create({
      name: "Support Agent",
      email: "agent@test.com",
      passwordHash,
      role: "AGENT",
      authProvider: "LOCAL",
      agentStatus: {
        approved: true,
        approvedBy: admin._id,
        approvedAt: new Date()
      },
      activeTicketCount: 0
    });

    const customer1 = await User.create({
      name: "Customer One",
      email: "customer1@test.com",
      passwordHash,
      role: "CUSTOMER",
      authProvider: "LOCAL"
    });

    const customer2 = await User.create({
      name: "Customer Two",
      email: "customer2@test.com",
      passwordHash,
      role: "CUSTOMER",
      authProvider: "LOCAL"
    });

    console.log("Users created");

    // =====================
    // TICKETS + MESSAGES
    // =====================

    const customers = [customer1, customer2];
    const priorities = ["LOW", "MEDIUM", "HIGH"];

    for (const customer of customers) {
      for (let i = 1; i <= 5; i++) {
        const ticket = await Ticket.create({
          customerId: customer._id,
          agentId: agent._id,
          status: "ASSIGNED",
          priority: priorities[i % priorities.length],
          assignedAt: new Date()
        });

        agent.activeTicketCount += 1;

        // Sample chat
        await Message.create([
          {
            ticketId: ticket._id,
            senderId: customer._id,
            senderRole: "CUSTOMER",
            content: `Hi, I need help with issue #${i}`
          },
          {
            ticketId: ticket._id,
            senderId: agent._id,
            senderRole: "AGENT",
            content: "Thanks for reaching out. I'm looking into this."
          },
          {
            ticketId: ticket._id,
            senderId: admin._id,
            senderRole: "ADMIN",
            content: "Admin here — monitoring this conversation."
          },
          {
            ticketId: ticket._id,
            senderId: customer._id,
            senderRole: "CUSTOMER",
            content: "Thanks for the quick response."
          }
        ]);
      }
    }

    await agent.save();

    console.log("Tickets and messages created");
    console.log("✅ Seed data successfully inserted");

    process.exit(0);

  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

runSeed();
