import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { message } from 'antd';
import axiosInstance from '../common/axiosInstance'; // Import axiosInstance

// Create the AuthContext
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(''); // Define email state
  const [password, setPassword] = useState(''); // Define password state
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  // Login function
  const handleLogin = async () => {
    try {
      // Debug: Log email and password before sending the request
      console.log('Login Request Data:', { email, password });
  
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });
  
      console.log('API Response:', response);
  
      if (response?.data?.token) {
        const token = response.data.token;
  
        // Save token in cookies
        Cookies.set('token', token, { expires: 1 });

        setUser({ token });
  
        message.success('Login Successful!');
        
        navigate('/dashboard', { replace: true });
        console.log(user);
        // Navigate to the dashboard
        // setTimeout(() => {
        //   navigate('/dashboard', { replace: true });
        // }, 100);
      } else {
        message.error('Invalid response from server. No token received.');
      }
    } catch (error) {
      console.error('Login failed:', error);
  
      // Debug: Log the error response from the server
      const errorMessage = error.response?.data?.message || 'Unknown error occurred';
      console.error('Error Response:', error.response?.data);
  
      message.error(`Login failed: ${errorMessage}`);
    }
  };
  

  const handleLogout = () => {
    Cookies.remove('token');
    setUser(null);
    navigate('/', { replace: true });
  };

  const value = {
    user,
    handleLogin,
    handleLogout,
    setEmail, // Expose setEmail to the component
    setPassword, // Expose setPassword to the component
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
