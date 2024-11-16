const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create user with a verification token
    const token = crypto.randomBytes(32).toString('hex');
    const user = new User({ name, email, password, verificationToken: token, isVerified: false });
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    const message = `Hello ${name},\n\nPlease verify your email by clicking the link below:\n${verificationUrl}\n\nIf you did not request this, please ignore this email.`;
    await sendEmail(email, 'Email Verification', message);

    res.status(201).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// Email Verification
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error in /verify-email:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login Endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || !user.isVerified) {
        return res.status(400).json({ message: 'Email not verified or user does not exist.' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error('Error in /login:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

module.exports = router;
