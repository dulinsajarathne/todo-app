// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();  // Make API call to logout
      navigate('/login');  // Redirect to login page
    } catch (err) {
      console.error('Error logging out');
    }
  };

  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
