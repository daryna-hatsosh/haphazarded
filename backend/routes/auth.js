import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import corsMiddleware from '../middleware/corsMiddleware.js';

const router = express.Router();

// Register a new user
router.post('/register', corsMiddleware, async (req, res) => {
  const { email, password, username } = req.body;
  console.log(email, password, username);
  try {
    const existingUser = await User.findOne({ email, username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = new User({ email, username, password });
    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login a user
router.post('/login', corsMiddleware, async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ userId: user._id, success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 