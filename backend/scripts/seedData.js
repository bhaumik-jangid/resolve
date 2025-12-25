import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import Ticket from "../src/models/Ticket.js";
import Message from "../src/models/Message.js";

const MONGO_URI = "mongodb+srv://azrael:resolve@resolve.bbtn3sy.mongodb.net/resolve";

const passwordHash = await bcrypt.hash("12345678", 10);

const adminsData = [
  { name: "Bhaumik Jangid", email: "bhaumik@admin.com" },
  { name: "Neeraj Sharma", email: "neeraj@admin.com" },
  { name: "Yashwardhan Singh", email: "yashwardhan@admin.com" }
];

const agentsData = [
  "Amit Verma",
  "Rohit Mehta",
  "Suresh Patel",
  "Kunal Malhotra",
  "Ankit Yadav"
];

const customersData = [
  "Ravi Kumar",
  "Pooja Singh",
  "Nikhil Jain",
  "Ananya Gupta",
  "Rahul Mishra",
  "Sneha Kapoor"
];

const ticketSubjects = [
  "Unable to login after password reset",
  "Payment deducted but order not confirmed",
  "App crashes on clicking dashboard",
  "Unable to update profile information",
  "Notifications not working properly",
  "Facing error while submitting support form"
];

const customerMessages = [
  "Hi, I am facing this issue since morning.",
  "I tried restarting the app but it didn’t help.",
  "This is affecting my work urgently.",
  "Can you please check this as soon as possible?",
  "I have already tried clearing cache."
];

const agentMessages = [
  "Thanks for reaching out. I’m looking into this.",
  "I can see the issue from logs, checking further.",
  "Can you confirm if this happens on all devices?",
  "This should be resolved now, please check.",
  "I’ve escalated this internally."
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    await User.deleteMany();
    await Ticket.deleteMany();
    await Message.deleteMany();

    /* ======================
       CREATE ADMINS
    ====================== */
    const admins = await User.insertMany(
      adminsData.map(a => ({
        ...a,
        role: "ADMIN",
        passwordHash
      }))
    );

    /* ======================
       CREATE AGENTS
    ====================== */
    const agents = await User.insertMany(
      agentsData.map(name => ({
        name,
        email: `${name.split(" ")[0].toLowerCase()}@agent.com`,
        role: "AGENT",
        passwordHash,
        agentStatus: { approved: true },
        activeTicketCount: 0
      }))
    );

    /* ======================
       CREATE CUSTOMERS
    ====================== */
    const customers = await User.insertMany(
      customersData.map(name => ({
        name,
        email: `${name.split(" ")[0].toLowerCase()}@customer.com`,
        role: "CUSTOMER",
        passwordHash
      }))
    );

    /* ======================
       CREATE TICKETS + MESSAGES
    ====================== */
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const agent = agents[i % agents.length];
      const subject = ticketSubjects[i % ticketSubjects.length];

      const ticket = await Ticket.create({
        subject,
        description: `Customer reports: "${subject}". Issue is reproducible and needs investigation.`,
        customerId: customer._id,
        agentId: agent._id,
        status: "ASSIGNED",
        priority: i % 2 === 0 ? "HIGH" : "MEDIUM",
        assignedAt: new Date()
      });

      agent.activeTicketCount += 1;
      await agent.save();

      await Message.insertMany([
        {
          ticketId: ticket._id,
          senderId: customer._id,
          senderRole: "CUSTOMER",
          content: customerMessages[i % customerMessages.length]
        },
        {
          ticketId: ticket._id,
          senderId: agent._id,
          senderRole: "AGENT",
          content: agentMessages[i % agentMessages.length]
        },
        {
          ticketId: ticket._id,
          senderId: admins[0]._id,
          senderRole: "ADMIN",
          content: "Admin note: Monitoring this ticket for quality assurance."
        }
      ]);
    }

    console.log("Seed data inserted successfully");
    process.exit();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seed();
