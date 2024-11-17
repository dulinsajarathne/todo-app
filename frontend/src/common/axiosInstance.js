import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from './configs';
import { message } from 'antd';

// Create an Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,  
});

// Add Authorization token from cookies to every request
axiosInstance.interceptors.response.use(
  response => response, // Continue if the response is successful
  error => {
    if (error.response && error.response.status === 401) {
      // Token is expired or invalid, remove the token and redirect to login
      Cookies.remove('token');
      window.location.href = '/login';  // Redirect to the login page
      message.error('Session expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
