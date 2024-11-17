// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { Input, Button, Card, message } from 'antd';
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
    return <p>Loading...</p>;
  }

  return (
    <Card title="User Profile" style={{ maxWidth: '400px', margin: '20px auto' }}>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <Button
        type="default"
        onClick={() => setShowPasswordForm(!showPasswordForm)}
        style={{ marginTop: '20px' }}
      >
        {showPasswordForm ? 'Cancel' : 'Change Password'}
      </Button>

      {showPasswordForm && (
        <>
          <h3 style={{ marginTop: '20px' }}>Change Password</h3>
          <Input.Password
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Input.Password
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Input.Password
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Button type="primary" loading={loading} onClick={handleChangePassword}>
            Save Password
          </Button>
        </>
      )}
    </Card>
  );
};

export default Profile;
