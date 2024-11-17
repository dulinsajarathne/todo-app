import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axiosInstance from '../common/axiosInstance'; // Import axiosInstance

// Create the AuthContext
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {  
  const [email, setEmail] = useState(''); // Define email state
  const [password, setPassword] = useState(''); // Define password state
  const navigate = useNavigate();  

  // Login function
  const handleLogin = async () => {
    try {
      // Make the login request
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      }, { withCredentials: true });
    
      if (response.status === 200 && response.data.token) {
        // Directly access the token from the response
        const { token } = response.data;
  
        // Store token and user data in the context or state
        if (token) {
          
          message.success('Login Successful!');
          navigate('/dashboard');
        } else {
          message.error('Login successful but no token found in response.');
        }
      } else {
        message.error('Invalid response from server.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Unknown error occurred';
      console.error('Error Response:', error.response?.data);
      message.error(`Login failed: ${errorMessage}`);
    }
  };  
  

  // Logout function
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
      message.success('Logged out successfully');
      navigate('/', { replace: true });
    } catch (error) {
      message.error('Logout failed');
    }
  };

  const value = {
    handleLogin,
    handleLogout,
    setEmail, // Expose setEmail to the component
    setPassword, // Expose setPassword to the component
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
