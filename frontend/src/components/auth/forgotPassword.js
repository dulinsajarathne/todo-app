import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import axiosInstance from '../../common/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handler for input changes
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle Forgot Password request
  const handleForgotPassword = async () => {
    if (!email) {
      message.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
        
      const response = await axiosInstance.post('/api/auth/forgot-password', {
        email,
      });

      if (response.status === 200) {
        message.success('Password reset email sent. Please check your inbox.');
      } else {
        message.error(response.data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot Password error:', error);
      message.error('An error occurred while sending reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{padding:'20px 0'}}>Forgot Password</h2>
      <Form layout="vertical">
        <Form.Item >
          <Input
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={onEmailChange}
          />
        </Form.Item>
        <Button
          type="primary"
          block
          loading={isLoading}
          onClick={handleForgotPassword}
        >
          Send Reset Email
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPassword;
