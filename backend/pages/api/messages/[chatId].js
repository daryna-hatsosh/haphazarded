import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/Message';
import { Kafka } from 'kafkajs';
import corsMiddleware from '../../../middleware/corsMiddleware';
import authMiddleware from '../../../middleware/authMiddleware';

const kafka = new Kafka({
  clientId: 'random-responses-producer',
  brokers: [process.env.BROKERS],
});

const producer = kafka.producer();

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

export default async function handler(req, res) {
  try {
    await corsMiddleware(req, res);
    await authMiddleware(req, res);

    const { chatId } = req.query;
    console.log(`Received request for chatId: ${chatId}`);

    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected.');

    if (req.method === 'GET') {
      try {
        const messages = await Message.find({ chatId });
        return res.status(200).json({ success: true, data: messages });
      } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
    } else if (req.method === 'POST') {
      try {
        const { content, userId } = req.body;
        console.log(`Creating new message for chatId: ${chatId}`);

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

        console.log('Connecting to Kafka broker...');
        await producer.connect();
        console.log('Producer connected.');

        console.log('Sending message to Kafka:', JSON.stringify(randomResponse));
        await producer.send({
          topic: 'random-responses',
          messages: [{ value: JSON.stringify(randomResponse) }],
        });
        console.log('Message sent to Kafka.');

        await producer.disconnect();
        console.log('Producer disconnected.');

        const responseMessage = new Message({
          chatId,
          content: randomResponse.message,
          userId: 'systemBot', // or another identifier for system-generated messages
        });

        await responseMessage.save();
        console.log('Response message saved:', responseMessage);

        return res.status(201).json({ success: true, data: newMessage });
      } catch (error) {
        console.error('Error processing POST request:', error);
        return res.status(400).json({ success: false, error: error.message });
      }
    } else {
      console.log('Invalid request method:', req.method);
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
