import React, { createContext, useState, useContext,useEffect } from 'react';
import { login, logout } from '../services/authService'; // Add your API service for authentication

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token }); // Set user if token is found
    }
  }, []);


  const handleLogin = async (email, password) => {
    try {
      const userData = await login(email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = { user, handleLogin, handleLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
