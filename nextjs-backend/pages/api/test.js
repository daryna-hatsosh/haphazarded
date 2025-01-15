import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching random quote from Quotable API...');
      const response = await axios.get('https://api.quotable.io/quotes/random', {
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
      });
      console.log('Quote fetched:', response.data.content);

      return res.status(200).json({ success: true, data: response.data[0].content });
    } catch (error) {
      console.error('Error fetching quote:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch quote' });
    }
  } else {
    console.log('Invalid request method:', req.method);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
