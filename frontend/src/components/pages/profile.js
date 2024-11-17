// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { Input, Button, Card, message,Row, Col, Spin  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axiosInstance from '../../common/axiosInstance';

const Profile = () => {
  const [user, setUser] = useState(null); // State to hold user details
  const [loading, setLoading] = useState(false);

  // Password change form fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State to toggle visibility of the password change form
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    // Fetch user profile from the backend
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/user/profile', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        message.error('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      message.error('All password fields are required!');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error('New password and confirmation do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/user/change-password', {
        currentPassword,
        newPassword,
      }, { withCredentials: true });
      message.success(response.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false); // Hide password form after successful change
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Spin tip="Loading" size="large"> </Spin>;
  }

  return (
    <Card
      title="User Profile"
      bordered={false}
      style={{
        maxWidth: '500px',
        margin: '20px auto',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <p style={{ fontSize: '16px' }}>
            <UserOutlined style={{ marginRight: '8px' }} />
            {user.name}
          </p>
          <br/>
          <p style={{ fontSize: '16px'}}>
            <strong>Email:</strong> {user.email}
          </p>
        </Col>

        <Col span={24}>
          <Button
            type="default"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            style={{ width: '100%' }}
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </Button>
        </Col>

        {showPasswordForm && (
          <>
            <Col span={24}>
              <h3 style={{ marginTop: '20px', fontSize: '18px' }}>Change Password</h3>
            </Col>

            <Col span={24}>
              <Input.Password
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ marginBottom: '10px' }}
                prefix={<LockOutlined />}
              />
            </Col>
            <Col span={24}>
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginBottom: '10px' }}
                prefix={<LockOutlined />}
              />
            </Col>
            <Col span={24}>
              <Input.Password
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ marginBottom: '20px' }}
                prefix={<LockOutlined />}
              />
            </Col>

            <Col span={24}>
              <Button
                type="primary"
                loading={loading}
                onClick={handleChangePassword}
                style={{ width: '100%' }}
              >
                Save Password
              </Button>
            </Col>
          </>
        )}
      </Row>
    </Card>
  );
};

export default Profile;
