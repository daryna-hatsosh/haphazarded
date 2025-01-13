import dbConnect from '../../../../utils/dbConnect';
import Message from '../../../../models/Message';
import corsMiddleware from '../../../../middleware/corsMiddleware';

export default async function handler(req, res) {
  await corsMiddleware(req, res, async () => {
    const { messageId } = req.query;

    await dbConnect();

    if (req.method === 'PUT') {
      try {
        const { text } = req.body;
        const updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { text },
          { new: true, runValidators: true }
        );
        if (!updatedMessage) {
          return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, data: updatedMessage });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    } else if (req.method === 'DELETE') {
      try {
        const deletedMessage = await Message.findByIdAndDelete(messageId);
        if (!deletedMessage) {
          return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, data: deletedMessage });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  });
}
