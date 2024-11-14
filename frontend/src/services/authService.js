// src/services/authService.js
import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust this URL to your backend API
  withCredentials: true,  // Send cookies (JWT) with requests
});

// Login function
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Register function
export const register = async (email, password) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

// Fetch tasks (requires authentication)
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

// Create task (requires authentication)
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// Logout function (removes cookie)
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
