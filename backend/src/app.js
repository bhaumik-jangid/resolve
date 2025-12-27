import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import messageRoutes from "./routes/message.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// app.use(cors());
app.use(cors({
  origin: process.env.CLIENT_URL,
  // origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/messages", messageRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Support Chat API running");
});

// 🔥 HEALTH CHECK API (DO NOT REMOVE)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),          
    timestamp: new Date().toISOString()
  });
});

export default app;
