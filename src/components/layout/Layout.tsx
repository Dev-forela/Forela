import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import { Drawer } from './Drawer';
import BottomNav from './BottomNav';
import AnimatedMenuButton from '../shared/AnimatedMenuButton';

interface LayoutProps {
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  title = 'Forela'
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuClick = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <Drawer isOpen={drawerOpen} onClose={handleCloseDrawer} />
      <div className={styles.layout}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <AnimatedMenuButton 
              isOpen={drawerOpen}
              onClick={handleMenuClick}
              color="#311D00"
            />
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </>
  );
}; 