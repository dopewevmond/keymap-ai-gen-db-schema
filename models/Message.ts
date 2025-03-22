import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
