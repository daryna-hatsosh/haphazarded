// /pages/api/chats/index.js
import dbConnect from '../../../utils/dbConnect';
import Chat from '../../../models/Chat';
import corsMiddleware from '../../../middleware/corsMiddleware';
import authMiddleware from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
  try {
    await corsMiddleware(req, res);
    await authMiddleware(req, res);

    await dbConnect();

    if (req.method === 'POST') {
      const { firstName, lastName } = req.body;
      const newChat = new Chat({ firstName, lastName, userId: req.userId, type: 'user' });
      await newChat.save();
      return res.status(201).json({ success: true, data: newChat });
    } else if (req.method === 'GET') {
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
      return res.status(200).json({ success: true, data: allChats });
    } else {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
