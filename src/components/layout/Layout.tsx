import React from 'react';
import styles from './Layout.module.css';
import hamburgerIcon from '../../assets/images/hamburger vectory.png';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onMenuClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Forela',
  onMenuClick 
}) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button 
            onClick={onMenuClick}
            aria-label="Open menu"
            className={styles.menuButton}
          >
            <img src={hamburgerIcon} alt="Open menu" style={{ width: 28, height: 28, display: 'block' }} />
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
    </div>
  );
}; 