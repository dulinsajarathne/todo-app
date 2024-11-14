import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import axiosInstance from '../../common/axiosInstance';  // Import the axios instance
import { useNavigate } from 'react-router-dom';  // To navigate after login

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // To navigate to protected route after login

  const handleLogin = async () => {
    try {
      // Make the login request using axiosInstance
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });

      const token = response.data.token;

      if (token) {
        // Save token in localStorage
        localStorage.setItem('token', token);

        message.success('Login Successful!');

        // Navigate to the dashboard after a successful login
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100); // Adding a slight delay to ensure everything is set
      } else {
        message.error('Invalid token received');
      }
    } catch (error) {
      // Handle error if the login fails
      message.error('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <Form>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="primary" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
