import React from 'react';
import styles from './Drawer.module.css';
import logo from '../../assets/images/forela-logo.png';
import pencilLine from '../../assets/images/pencil-line.png';
import {
  User,
  Settings as SettingsIcon,
  FlaskConical,
  HelpCircle,
  Send,
  Crown,
  BookOpen,
  Handshake,
  FolderHeart,
  LineChart,
  FileText,
  BriefcaseMedical,
  Link2,
  Scan,
  Plus
} from 'lucide-react';
import { useBottomNav } from '../../context/BottomNavContext';
import { useNavigate } from 'react-router-dom';

interface DrawerNavLink {
  label: string;
  icon: React.ReactNode;
  shortcutKey?: string;
  onClick: () => void;
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { shortcuts, addShortcut, removeShortcut } = useBottomNav();
  const navigate = useNavigate();

  // Top section (no plus/X)
  const topLinks: DrawerNavLink[] = [
    { label: 'My Profile', icon: <User size={20} />, onClick: () => { onClose(); navigate('/'); } },
    { label: 'Settings', icon: <SettingsIcon size={20} />, onClick: () => { onClose(); navigate('/settings'); } },
    { label: 'Labs', icon: <FlaskConical size={20} />, onClick: () => { onClose(); navigate('/'); } },
    { label: 'Help', icon: <HelpCircle size={20} />, onClick: () => { onClose(); navigate('/'); } },
    { label: 'Refer a Friend', icon: <Send size={20} />, onClick: () => { onClose(); navigate('/'); } },
  ];

  // Bottom section (with plus/X)
  const bottomLinks: DrawerNavLink[] = [
    { label: 'Care Plan', icon: <Crown size={20} />, shortcutKey: 'careplan', onClick: () => { onClose(); navigate('/'); } },
    { label: 'Journal', icon: <img src={pencilLine} alt="Journal" style={{ width: 20, height: 20, display: 'block' }} />, shortcutKey: 'journal', onClick: () => { onClose(); navigate('/journal'); } },
    { label: 'Companion', icon: <Handshake size={20} />, shortcutKey: 'companion', onClick: () => { onClose(); navigate('/companion'); } },
    { label: 'Symptoms', icon: <FolderHeart size={20} />, shortcutKey: 'symptoms', onClick: () => { onClose(); navigate('/'); } },
    { label: 'Trends', icon: <LineChart size={20} />, shortcutKey: 'trends', onClick: () => { onClose(); navigate('/trends'); } },
    { label: 'Reports', icon: <FileText size={20} />, shortcutKey: 'reports', onClick: () => { onClose(); navigate('/'); } },
    { label: 'Medical History', icon: <BriefcaseMedical size={20} />, shortcutKey: 'medicalhistory', onClick: () => { onClose(); navigate('/'); } },
    { label: 'Menu Scan', icon: <Scan size={20} />, shortcutKey: 'menuscan', onClick: () => { onClose(); navigate('/'); } },
  ];

  return (
    <div className={styles.drawer + (isOpen ? ' ' + styles.open : '')}>
      <div className={styles.header}>
        <img src={logo} alt="Forela logo" className={styles.logo} />
        <button className={styles.closeButton} onClick={onClose} aria-label="Close menu">×</button>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.section}>
          {topLinks.map((link, idx) => (
            <li key={idx} className={styles.drawerItem}>
              <button className={styles.navLink} onClick={link.onClick}>
                <span className={styles.icon}>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <hr className={styles.divider} />
        <ul className={styles.section}>
          {bottomLinks.map((link, idx) => {
            const isShortcut = link.shortcutKey && shortcuts.includes(link.shortcutKey as any);
            return (
              <li key={idx} className={styles.drawerItem}>
                <button className={styles.navLink} onClick={link.onClick}>
                  <span className={styles.icon}>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
                {link.shortcutKey && (
                  <button
                    className={styles.shortcutBtn}
                    onClick={() =>
                      isShortcut
                        ? removeShortcut(link.shortcutKey as any)
                        : addShortcut(link.shortcutKey as any)
                    }
                    aria-label={isShortcut ? `Remove ${link.label} from shortcuts` : `Add ${link.label} to shortcuts`}
                  >
                    <span
                      className={
                        styles.plusIcon +
                        (isShortcut ? ' ' + styles.rotated : '')
                      }
                    >
                      <Plus size={20} />
                    </span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}; 