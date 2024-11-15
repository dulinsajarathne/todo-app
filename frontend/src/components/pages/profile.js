// src/pages/Profile.js
import React, { useState } from 'react';
import { Input, Button, Card, message } from 'antd';
import { useAuth } from '../../context/authContext';
import axiosInstance from '../../common/axiosInstance';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.put('/api/users/profile', { name, email });
      setUser(response.data);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Edit Profile">
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button type="primary" loading={loading} onClick={handleUpdateProfile}>
        Save Changes
      </Button>
    </Card>
  );
};

export default Profile;
