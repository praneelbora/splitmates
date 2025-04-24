// MainLayout.jsx
import React from 'react';
import MobileNavbar from './MobileNavbar';
import SideNavbar from './SideNavbar';
import { isMobile } from 'react-device-detect';

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100dvh' }}>
      {!isMobile && <SideNavbar />}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isMobile && <MobileNavbar />}
        <main style={{ paddingBlock: isMobile ? '2rem' : '2rem' ,paddingInline: isMobile ? '1.5rem' : '1.5rem'}}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
