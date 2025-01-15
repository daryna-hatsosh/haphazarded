import Cors from 'cors';

// Determine the allowed origin based on custom environment variables
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3001';

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: allowedOrigin,
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        console.error('CORS middleware error:', result);
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function corsMiddleware(req, res, next) {
  try {
    await runMiddleware(req, res, cors);
    next(); // Ensure next() is called to pass control to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ success: false, message: 'CORS error' });
  }
} 