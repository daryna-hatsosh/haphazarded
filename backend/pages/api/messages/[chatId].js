import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/Message';
import corsMiddleware from '../../../middleware/corsMiddleware';

export default async function handler(req, res) {
  try {
    console.log('Handler invoked for /api/messages/[chatId]'); // Initial debug log
    await corsMiddleware(req, res);
    console.log('CORS middleware executed');

    const { chatId } = req.query;
    console.log(`Chat ID: ${chatId}`);

    await dbConnect();
    console.log('Database connected');

    if (req.method === 'GET') {
      try {
        const messages = await Message.find({ chatId });
        console.log('Messages fetched:', messages);
        return res.status(200).json({ success: true, data: messages });
      } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
    } else if (req.method === 'POST') {
      try {
        const { content, sender } = req.body;
        console.log('Creating new message:', { content, sender });
        const newMessage = new Message({ chatId, content, sender });
        await newMessage.save();
        console.log('New message saved:', newMessage);
        return res.status(201).json({ success: true, data: newMessage });
      } catch (error) {
        console.error('Error creating message:', error);
        return res.status(400).json({ success: false, error: error.message });
      }
    } else {
      console.log('Method not allowed');
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
