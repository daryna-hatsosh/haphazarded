import dbConnect from '../../../utils/dbConnect';
import Chat from '../../../models/Chat';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        const { firstName, lastName } = req.query;

        try {
            // Build a query object based on the provided query parameters
            const query = {};
            if (firstName) {
                query.firstName = { $regex: firstName, $options: 'i' }; // Case-insensitive partial match
            }
            if (lastName) {
                query.lastName = { $regex: lastName, $options: 'i' }; // Case-insensitive partial match
            }

            const chats = await Chat.find(query);
            res.status(200).json({ success: true, data: chats });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
