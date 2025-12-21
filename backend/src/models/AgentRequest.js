import mongoose from "mongoose";

const agentRequestSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    reviewedAt: Date,
    remarks: String
  },
  { timestamps: true }
);

export default mongoose.model("AgentRequest", agentRequestSchema);
