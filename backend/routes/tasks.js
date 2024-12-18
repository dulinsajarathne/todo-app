const express = require('express');
const Task = require('../models/task');
const protect = require('../middleware/auth');
const router = express.Router();

// Create a new task (Protected)
router.post('/', protect, async (req, res) => {
  const { title, description, dueDate } = req.body;
  const userId = req.user.userId;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      userId, // Associate the task with the authenticated user
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
});

// Get all tasks for the authenticated user (Protected)
router.get('/', protect, async (req, res) => {
  const userId = req.user.userId;

  try {
    const tasks = await Task.find({ userId }); // Fetch tasks only for the authenticated user
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Update a task by ID (Protected)
router.put('/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, dueDate } = req.body;
  const userId = req.user.userId;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId }, // Ensure the task belongs to the authenticated user
      { title, description, completed, dueDate },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error });
  }
});

// Mark a task as completed by ID (Protected)
router.patch('/:id/complete', protect, async (req, res) => {
  const { id } = req.params;  // Task ID from the URL
  const userId = req.user.userId; // User ID from authentication

  try {
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update the task to mark it as completed
    task.completed = true;
    task.updatedAt = new Date(); // Update the updatedAt field

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);  // Return the updated task
  } catch (error) {
    res.status(400).json({ message: 'Error marking task as completed', error });
  }
});



// Delete a task by ID (Protected)
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  console.log(req.user.email);

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task', error });
  }
});

module.exports = router;
