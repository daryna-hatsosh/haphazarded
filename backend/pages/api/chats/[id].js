import dbConnect from '../../../utils/dbConnect';
import Chat from '../../../models/Chat';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const chat = await Chat.findById(id);
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Chat not found' });
      }
      res.status(200).json({ success: true, data: chat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { firstName, lastName } = req.body;
      const updatedChat = await Chat.findByIdAndUpdate(
        id,
        { firstName, lastName },
        { new: true, runValidators: true }
      );
      if (!updatedChat) {
        return res.status(404).json({ success: false, message: 'Chat not found' });
      }
      res.status(200).json({ success: true, data: updatedChat });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedChat = await Chat.findByIdAndDelete(id);
      if (!deletedChat) {
        return res.status(404).json({ success: false, message: 'Chat not found' });
      }
      res.status(200).json({ success: true, data: deletedChat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
