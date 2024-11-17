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
    console.log('AuthProvider: Token from cookies after useEffect runs:', token); // Debugging log

    if (token) {
      setUser({ token });
      console.log('User set with token:', { token }); // Debugging log
    } else {
      setUser(null);
      console.log('No token found, setting user to false.'); // Debugging log
    }
  }, []);

  // Login function
  const handleLogin = async () => {
    try {
      console.log('Login Request Data:', { email, password });
  
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      }, { withCredentials: true });
  
      console.log('API Response:', response);
  
      if (response.status === 200) {
        Cookies.set('token', response.data.token, { expires: 1 }); // Set token to cookies
        console.log('Token after setting (in handleLogin):', Cookies.get('token')); // Debugging log
        
        message.success('Login Successful!');
        setUser({ token: response.data.token });
        navigate('/dashboard');
      } else {
        message.error('Invalid response from server. No token received.');
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
      Cookies.remove('token'); // Remove token from cookies
      message.success('Logged out successfully');
      navigate('/', { replace: true });
    } catch (error) {
      message.error('Logout failed');
    }
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
