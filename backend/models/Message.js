// /models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true, // Message content is required
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // Reference to the Chat model
    required: true, // Every message must belong to a chat
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
