// index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');  // Import MongoDB connection logic
const taskRoutes = require('./routes/tasks'); // Import tasks routes
const authRoutes = require('./routes/auth'); 
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();


// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Use the auth 
app.use('/api/auth', authRoutes);  // Authentication routes

// Use the tasks route
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Express.js!');
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running smoothly!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
