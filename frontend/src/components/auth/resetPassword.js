// In your frontend (React)
import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import axiosInstance from '../../common/axiosInstance';
import { useParams } from 'react-router-dom';
import backgroundImage from "../../common/backgroundImage.jpg";
import '../pages/landingPage.css';

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/auth/reset-password/${token}`, {
        password,
      });
      message.success(response.data.message);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="landing-container">
      <div className="text-section" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
        <h2 style={{padding:'20px 0'}}>Reset Password</h2>
      <Form>
      <Form.Item>
      <Input.Password
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      </Form.Item>
      <Form.Item>
      <Input.Password
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      </Form.Item>
      <Button type="primary" onClick={handleResetPassword}>
        Reset Password
      </Button>
    </Form>
    </div>
    <div className="image-section"
        style={{ backgroundImage: `url(${backgroundImage})` }}></div>
    </div>
      
  );
};

export default ResetPassword;
