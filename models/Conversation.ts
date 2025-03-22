import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage extends Document {
  _id: string;
  role: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    _id: { type: String, required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

interface IConversation extends Document {
  _id: string;
  title: string;
  userId: string;
  databaseSchema: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    userId: { type: String, required: true },
    databaseSchema: { type: String, required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const ConversationModel: Model<IConversation> =
  mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", conversationSchema);

export default ConversationModel;
