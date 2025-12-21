import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    targetId: mongoose.Schema.Types.ObjectId,
    targetType: String
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
