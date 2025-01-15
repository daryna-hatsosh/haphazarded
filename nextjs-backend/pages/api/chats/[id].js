import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/Message';
import corsMiddleware from '../../../middleware/corsMiddleware';

export default async function handler(req, res) {
  try {
    await corsMiddleware(req, res);
    await authMiddleware(req, res);

    const { chatId } = req.query;

    await dbConnect();

    if (req.method === 'GET') {
      try {
        const messages = await Message.find({ chatId });
        return res.status(200).json({ success: true, data: messages });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    } else if (req.method === 'POST') {
      try {
        const { content, userId } = req.body;
        const newMessage = new Message({ chatId, content, userId });
        await newMessage.save();
        return res.status(201).json({ success: true, data: newMessage });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    } else {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
