import jwt from 'jsonwebtoken';

const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default verifyToken;
