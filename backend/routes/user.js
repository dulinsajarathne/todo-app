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

// Fetch logged-in user's profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    console.log(await User.findById(req.user.userId));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

// Change password
router.post('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    console.log(req.user);
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    console.log(currentPassword);
    const isMatch = await user.matchPassword(currentPassword);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error });
  }
});

module.exports = router;
