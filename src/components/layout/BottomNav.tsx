import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Crown,
  BookOpen,
  Handshake,
  FolderHeart,
  LineChart,
  FileText,
  BriefcaseMedical,
  Link2,
  Scan,
  Edit3,
  Settings as SettingsIcon
} from 'lucide-react';
import styles from './BottomNav.module.css';
import { useBottomNav } from '../../context/BottomNavContext';
import pencilLine from '../../assets/images/pencil-line.png';

const iconMap: Record<string, React.ReactNode> = {
  careplan: <Crown size={24} />,
  journal: <img src={pencilLine} alt="Journal" style={{ width: 24, height: 24, display: 'block' }} />,
  companion: <Handshake size={24} />,
  symptoms: <FolderHeart size={24} />,
  trends: <LineChart size={24} />,
  reports: <FileText size={24} />,
  medicalhistory: <BriefcaseMedical size={24} />,
  integrations: <Link2 size={24} />,
  menuscan: <Scan size={24} />,
  settings: <SettingsIcon size={24} />,
};

const routeMap: Record<string, string> = {
  careplan: '/',
  journal: '/journal',
  companion: '/companion',
  symptoms: '/',
  trends: '/trends',
  reports: '/',
  medicalhistory: '/',
  integrations: '/',
  menuscan: '/',
  settings: '/settings',
};

const labelMap: Record<string, string> = {
  careplan: 'Care Plan',
  journal: 'Journal',
  companion: 'Companion',
  symptoms: 'Symptoms',
  trends: 'Trends',
  reports: 'Reports',
  medicalhistory: 'Medical History',
  integrations: 'Integrations',
  menuscan: 'Menu Scan',
  settings: 'Settings',
};

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shortcuts } = useBottomNav();

  // Always show Home first, then user's selected shortcuts
  const navItems = [
    { label: 'My Profile', icon: <Home size={24} />, route: '/' },
    ...shortcuts.map((key) => ({
      label: labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
      icon: iconMap[key],
      route: routeMap[key],
    })),
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => (
        <button
          key={item.route}
          className={
            styles.navButton +
            (location.pathname === item.route ? ' ' + styles.active : '')
          }
          onClick={() => navigate(item.route)}
          aria-label={item.label}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav; 