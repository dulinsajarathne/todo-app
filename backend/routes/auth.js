const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Register Endpoint
router.post('/register',
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
    console.log('Received registration request:', req.body);

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(200).json({ message: 'Email is already registered' });
      }
      const token = crypto.randomBytes(32).toString('hex');
      const user = new User({ name, email, password, verificationToken: token, isVerified: false });
      console.log('User created:', user);
      await user.save();

      // Send verification email
      const verificationUrl = `${process.env.BACKEND_URL}api/auth/verify-email/${token}`;
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
      res.clearCookie('token', { path: '/' });
      const user = await User.findOne({ email });

      if (!user || !user.isVerified) {
        return res.status(400).json({ message: 'Email not verified or user does not exist.' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,  // Cannot be accessed through JavaScript
        secure: process.env.NODE_ENV === 'production',  // Only over HTTPS in production
        sameSite: 'Strict',  // Prevents CSRF attacks
        maxAge: 60 * 60 * 1000,  // 1 hour expiry
        path: '/'  // Available across the entire app
      });


      res.status(200).json({ token });
    } catch (error) {
      console.error('Error in /login:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
);


// Logout Endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});


// Resend verification route
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified.' });
    }

    // Generate a new verification URL (using the existing token)
    const verificationUrl = `${process.env.BACKEND_URL}verify-email/${user.verificationToken}`;
    const message = `Hello ${user.name},\n\nPlease verify your email by clicking the link below:\n${verificationUrl}\n\nIf you did not request this, please ignore this email.`;

    // Send the email again
    await sendEmail(user.email, 'Email Verification', message);

    res.status(200).json({ message: 'Verification email resent. Please check your inbox.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

//Forgot-Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('Received email for password reset:', req.body.email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token (implement token generation logic)
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Send password reset email
    const resetUrl = `${process.env.FRONTEND_URL}reset-password/${resetToken}`;
    const message = `Click on the link to reset your password: ${resetUrl}`;
    await sendEmail(user.email, 'Password Reset Request', message);

    res.status(200).json({ message: 'Reset email sent' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Reset Password from verification email
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
  // Update the password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  res.status(200).json({ message: 'Password has been reset successfully' });
});

// /api/auth/check route to verify token
router.get('/check', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Token is valid, return success
    res.status(200).json({ message: 'Authenticated' });
  });
});



// Import the token verification middleware

// The route to get authenticated user's details
router.get('/user', verifyToken, (req, res) => {
  try {
    // Send the user data in the response
    res.json(req.user); // `req.user` is populated by the `verifyToken` middleware
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});













module.exports = router;
