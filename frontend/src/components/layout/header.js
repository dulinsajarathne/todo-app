import React from 'react';
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const handleEditProfile = () => {
    navigate('/profile');
  };

  // Define menu items directly
  const menuItems = [
    {
      key: '1',
      icon: <EditOutlined />,
      label: 'Edit Profile',
      onClick: handleEditProfile,
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 30px', background: '#093a6b' }}>
      <h2 style={{ color: '#fff', margin: 0 }}>TaskMate Dashboard</h2>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar src={user?.profilePicture} icon={<UserOutlined />} />
          <span style={{ color: '#fff', marginLeft: '10px' }}>{user?.name}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default Header;
