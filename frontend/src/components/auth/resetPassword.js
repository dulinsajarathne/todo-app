// In your frontend (React)
import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import axiosInstance from '../../common/axiosInstance';
import { useParams } from 'react-router-dom';

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
    <Form>
      <Input.Password
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input.Password
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button type="primary" onClick={handleResetPassword}>
        Reset Password
      </Button>
    </Form>
  );
};

export default ResetPassword;
