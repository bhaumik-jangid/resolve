import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["OPEN", "ASSIGNED", "RESOLVED", "CLOSED"],
      index: true
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW"
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    assignedAt: Date,
    resolvedAt: Date,
    closedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
