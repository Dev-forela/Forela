import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import hamburgerIcon from '../../assets/images/hamburger vectory.png';
import { Drawer } from './Drawer';
import BottomNav from './BottomNav';

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
            <button 
              onClick={handleMenuClick}
              aria-label="Open menu"
              className={styles.menuButton}
            >
              <img src={hamburgerIcon} alt="Open menu" style={{ width: 28, height: 28, display: 'block' }} />
            </button>
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