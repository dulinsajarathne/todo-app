import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space } from 'antd';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigateToRegister = () => {
    navigate('/register');  // Navigate to the Register page
  };

  const handleNavigateToLogin = () => {
    navigate('/login');  // Navigate to the Login page
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        background: '#f0f2f5',
      }}
    >
      <h1 style={{ marginBottom: '20px' }}>Welcome to Our App</h1>
      <p style={{ marginBottom: '40px', fontSize: '18px', color: '#555' }}>
        Please log in or register to continue.
      </p>
      <Space>
        <Button type="primary" size="large" onClick={handleNavigateToLogin}>
          Login
        </Button>
        <Button size="large" onClick={handleNavigateToRegister}>
          Register
        </Button>
      </Space>
    </div>
  );
};

export default LandingPage;
