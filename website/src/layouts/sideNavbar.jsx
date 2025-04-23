// SideNavbar.jsx
import React from 'react';

const SideNavbar = () => {
  return (
    <div style={{
      width: '80px',
      backgroundColor: '#1f1f1f',
      color: '#EBF1D5',
      padding: '1rem',
      height: '100vh'
    }}>
      <h3>Dashboard</h3>
      <ul>
        <li>Home</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default SideNavbar;
