import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,

    authProvider: {
      type: String,
      enum: ["LOCAL", "GOOGLE"],
      default: "LOCAL"
    },

    role: {
      type: String,
      enum: ["CUSTOMER", "AGENT", "ADMIN"],
      default: "CUSTOMER"
    },

    agentStatus: {
      approved: { type: Boolean, default: false },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      approvedAt: Date
    },

    isOnline: { type: Boolean, default: false },
    lastSeenAt: Date,

    activeTicketCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
