import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../common/axiosInstance'; // Import your axios instance

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State to track authentication status

  useEffect(() => {
    // Check if the user is authenticated by making a request to a protected route
    const checkAuth = async () => {
      try {
        // Make an API call to verify if the user is authenticated
        const response = await axiosInstance.get('/api/auth/check', { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true); // User is authenticated
        }
      } catch (error) {
        setIsAuthenticated(false); // User is not authenticated
      }
    };

    checkAuth(); // Run the authentication check
  }, []);

  // While checking, render a loading state or nothing
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (protected components)
  return children;
};

export default ProtectedRoute;
