import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space } from 'antd';
import './landingPage.css';  // Optional: Use a separate CSS file for styling
import backgroundImage from '../../common/backgroundImage.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <div className="text-section">
        <h1>TaskMate</h1>
        <p style={{ marginBottom: '40px', fontSize: '18px', color: '#555' }}>
          Your trusted companion to manage and organize your tasks efficiently.
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
      <div className="image-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}></div>
    </div>
  );
};

export default LandingPage;
