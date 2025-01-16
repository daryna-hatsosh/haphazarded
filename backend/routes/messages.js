import express from 'express';
import Message from '../models/Message.js';
import authMiddleware from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';
import { io } from '../server.js';
import { sendMessageToKafka } from '../services/kafkaService.js'; // Import the Kafka service

dotenv.config();

const router = express.Router();

// Predefined list of random responses
const predefinedResponses = [
  "Hello! How can I assist you today?",
  "Thank you for reaching out!",
  "I'm here to help, what do you need?",
  "Let's solve this together!",
  "Your request is important to us.",
  "Please hold on while I check that for you.",
  "I'm glad to assist you with that.",
  "What else can I do for you today?",
  "Feel free to ask any questions.",
  "I'm here to provide support."
];

// Function to select a random response from the predefined list
function getRandomResponse() {
  const randomIndex = Math.floor(Math.random() * predefinedResponses.length);
  return predefinedResponses[randomIndex];
}

// Get messages for a chat with pagination
router.get('/:chatId', authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 5 } = req.query; // Default to page 1 and 5 messages per page

  try {
    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalMessages = await Message.countDocuments({ chatId });
    const totalPages = Math.ceil(totalMessages / limit);

    res.status(200).json({
      success: true,
      data: messages,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new message
router.post('/:chatId', authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const { content, userId } = req.body;
  try {
    const newMessage = new Message({ chatId, content, userId });
    await newMessage.save();
    console.log('New message saved:', newMessage);

    // Generate a random response from the predefined list
    console.log('Selecting random response...');
    const randomResponseMessage = getRandomResponse();
    console.log('Random response selected:', randomResponseMessage);

    const randomResponse = {
      chatId,
      message: randomResponseMessage,
      timestamp: Date.now(),
    };

    // Send message to Kafka
    await sendMessageToKafka('random-responses', randomResponse);

    const responseMessage = new Message({
      chatId,
      content: randomResponse.message,
      userId: '678531deb05ff3f439e2a4f0', // or another identifier for system-generated messages
    });

    await responseMessage.save();
    console.log('Response message saved:', responseMessage);

    console.log('Active rooms:', io.sockets.adapter.rooms);
    io.to(chatId).emit('message', responseMessage);

    console.log('Response message emitted to WebSocket:', responseMessage);

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router; 