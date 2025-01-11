// /models/Chat.js
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true, // First name is required
  },
  lastName: {
    type: String,
    required: true, // Last name is required
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  type: {
    type: String,
    enum: ['predefined', 'user'],
    default: 'user',
  },
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
