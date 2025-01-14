import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/Message';
import { Kafka } from 'kafkajs';
import axios from 'axios';
import corsMiddleware from '../../../middleware/corsMiddleware';
import authMiddleware from '../../../middleware/authMiddleware';

const kafka = new Kafka({
  clientId: 'random-responses-producer',
  brokers: [process.env.BROKERS],
});

const producer = kafka.producer();

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
          return res.status(500).json({ success: false, error: error.message });
        }
    } else if (req.method === 'POST') {
      try {
        const { content } = req.body;
        console.log(`Creating new message for chatId: ${chatId}`);

        const newMessage = new Message({ chatId, content });
        await newMessage.save();
        console.log('New message saved:', newMessage);

        // Produce a random response
        console.log('Fetching random quote...');
        const response = await axios.get('https://api.quotable.io/random');
        console.log('Random quote fetched:', response.data.content);

        const randomResponse = {
          chatId,
          message: response.data.content,
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
