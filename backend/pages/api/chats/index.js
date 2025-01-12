// /pages/api/chats/index.js
import dbConnect from '../../../utils/dbConnect';
import Chat from '../../../models/Chat';
import corsMiddleware from '../../../middleware/corsMiddleware';

export default async function handler(req, res) {
  await corsMiddleware(req, res, async () => {
    await dbConnect();

    if (req.method === 'POST') {
      try {
        const { firstName, lastName } = req.body;
        const newChat = new Chat({ firstName, lastName });
        await newChat.save();
        res.status(201).json({ success: true, data: newChat });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    } else if (req.method === 'GET') {
      try {
        const chats = await Chat.find();
        res.status(200).json(chats);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error });
      }
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  });
}
