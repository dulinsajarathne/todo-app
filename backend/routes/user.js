const express = require('express');
const User = require('../models/User');
const protect = require('../middleware/auth');
const router = express.Router();

// Route to get the logged-in user's data
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Send the user's details (excluding password)
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
