export default function handler(req, res) {
  // Respond with a simple status message
  res.status(200).json({ status: 'ok', message: 'Service is running' });
}
