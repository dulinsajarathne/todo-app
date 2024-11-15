// src/components/Layout.js
import React from 'react';
import Header from './header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
