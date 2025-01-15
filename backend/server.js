import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.MONGODB_URI || !process.env.PORT) {
  console.error('Error: Missing required environment variables.');
  process.exit(1);
}

// Initialize Express app
const app = express();
// Allow requests from your frontend's origin
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN, // Adjust this to match your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // If you need to send cookies or HTTP authentication
}));
app.use(express.json());

// MongoDB connection setup
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the application on database connection failure
  }
})();

// Import routes
import chatRoutes from './routes/chats.js';
import messageRoutes from './routes/messages.js';
import authRoutes from './routes/auth.js';

// Use routes
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
      status: 'ok',
      mongoStatus,
      message: 'Service is running',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Health check failed' });
  }
});

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this to your needs
    methods: ['GET', 'POST'],
  },
});

// WebSocket event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Join a chat room
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Leave a chat room
  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { io };

export default app;
