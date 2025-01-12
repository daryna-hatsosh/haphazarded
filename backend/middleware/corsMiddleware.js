import Cors from 'cors';

// Determine the allowed origin based on custom environment variables
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3001'; // Default to local development URL

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: allowedOrigin,
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function corsMiddleware(req, res, next) {
  await runMiddleware(req, res, cors);
  next();
} 