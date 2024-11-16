import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import axiosInstance from '../../common/axiosInstance';
import { Link } from 'react-router-dom';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false); // Track if email was sent
  const [email, setEmail] = useState(''); // Track email input value

  // Register handler
  const handleRegister = async (values) => {
    console.log('Registering with: ', values);
    setIsLoading(true);

    try {
      // Send a POST request to the backend for registration
      const response = await axiosInstance.post('/api/auth/register', {
        name: values.username,
        email: values.email,
        password: values.password,
      });

      const data = response.data;
      if (response.status === 201) {
        setIsEmailSent(true);
        message.success(data.message); 
        // Success message after registration
        console.log('Registration successful:', data);
      
      } else {
        message.error(data.message || 'Registration failed');
      } 
    } catch (error) {
      console.error('Registration error:', error);
      message.error('An error occurred while registering');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Verification Email using axiosInstance
  const handleResendVerification = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/resend-verification', {
        email, // Pass the email from the state
      });

      const data = response.data;

      if (response.status === 200) {
        message.success(data.message); // Success message after email resend
      } else {
        message.error(data.message || 'Failed to resend email');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      message.error('An error occurred while resending the verification email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Register</h2>
      <Form onFinish={handleRegister} layout="vertical">
        <Form.Item
          label="Full Name"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input 
            type="email" 
            value={email} // Set value from state
            onChange={(e) => setEmail(e.target.value)} // Update state on change
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>

        {/* Confirm Password Field */}
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { 
              required: true, 
              message: 'Please confirm your password!' 
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Register
          </Button>
        </Form.Item>
      </Form>

      {isEmailSent && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Verification email sent! Please check your inbox.</p>
          <Button
            type="link"
            onClick={handleResendVerification} // Use state directly
            loading={isLoading}
          >
            Resend verification email
          </Button>
          <div style={{ marginTop: '10px' }}>
            <Link to="/login">Go to Login</Link> {/* Add "Go to Login" link */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
