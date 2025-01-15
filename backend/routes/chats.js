import express from 'express';
import Chat from '../models/Chat.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all chats
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userChats = await Chat.find({ userId: req.userId, type: 'user' }).sort({ createdAt: -1 });
    let predefinedChats = await Chat.find({ type: 'predefined', userId: req.userId }).sort({ createdAt: -1 });

    if (predefinedChats.length === 0) {
      const predefinedChatTemplates = [
        { firstName: 'Daryna', lastName: 'Haphazarded', type: 'predefined', userId: req.userId },
        { firstName: 'Sofiia', lastName: 'Haphazarded', type: 'predefined', userId: req.userId },
        { firstName: 'Common', lastName: 'Sense', type: 'predefined', userId: req.userId },
      ];
      predefinedChats = await Chat.insertMany(predefinedChatTemplates);
    }

    const allChats = [...predefinedChats, ...userChats];
    res.status(200).json({ success: true, data: allChats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new chat
router.post('/', authMiddleware, async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const newChat = new Chat({ firstName, lastName, userId: req.userId, type: 'user' });
    await newChat.save();
    res.status(201).json({ success: true, data: newChat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 