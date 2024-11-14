// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Import the User model
const router = express.Router();

// User Registration Route
router.post(
  '/register',
  // Validation middleware
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create a new user
      const newUser = new User({ name, email, password });
      await newUser.save();

      // Send response
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// User Login Route
router.post(
  '/login',
  // Validation middleware
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create and sign JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,  // You should define a JWT secret in .env
        { expiresIn: '1h' }
      );

      // Send the token in the response
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

module.exports = router;
