export default function handler(req, res) {
    if (req.method === 'GET') {
      // Handle GET request
      res.status(200).json({ friends: ["Sofiia", "Daryna", "Marko", "Ostap"] });
    } else {
      // Handle other HTTP methods
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }