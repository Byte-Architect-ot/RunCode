import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(400).json({ message: 'User already exists' });
    user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, 'your-secret-key-12345', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, rating: user.rating } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, 'your-secret-key-12345', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, rating: user.rating } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email, rating: req.user.rating } });
});

export default router;
