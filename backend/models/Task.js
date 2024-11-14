// models/Task.js
const mongoose = require('mongoose');

// Define the schema for a To-Do task
const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Task model using the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
