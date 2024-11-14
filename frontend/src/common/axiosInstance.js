import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',  // Adjust your base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally you can add interceptors to handle the token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// You can also handle global error responses with interceptors if needed
axiosInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized access (e.g., logout, redirect to login)
  }
  return Promise.reject(error);
});

export default axiosInstance;
