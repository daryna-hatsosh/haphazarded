import express from 'express';
import Message from '../models/Message.js';
import authMiddleware from '../middleware/authMiddleware.js';
import corsMiddleware from '../middleware/corsMiddleware.js';

const router = express.Router();

// Get messages for a chat
router.get('/:chatId', corsMiddleware, authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new message
router.post('/:chatId', corsMiddleware, authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const { content, userId } = req.body;
  try {
    const newMessage = new Message({ chatId, content, userId });
    await newMessage.save();
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router; 