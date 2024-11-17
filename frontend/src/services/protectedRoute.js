import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../common/axiosInstance';
import { Spin } from 'antd';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/check-auth', { withCredentials: true });
        console.log('Authentication check response:', response); // Debugging log
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Authentication check failed:', error); // Debugging log
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  console.log('isAuthenticated:', isAuthenticated); // Debugging log
  if (!user) {
    return <Navigate to="/login" />;
  }
  // Display loading spinner while checking authentication status
  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading...">
          <div style={{ height: '100px' }} /> {/* Nested element to satisfy Spin requirement */}
        </Spin>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;
