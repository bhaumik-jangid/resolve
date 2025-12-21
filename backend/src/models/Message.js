import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    senderRole: {
      type: String,
      enum: ["CUSTOMER", "AGENT", "ADMIN"],
      required: true
    },

    content: {
      type: String,
      required: true
    },

    deliveryStatus: {
      sent: { type: Boolean, default: true },
      delivered: { type: Boolean, default: false },
      readAt: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
