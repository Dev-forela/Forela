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
  BarChart2,
  Settings as SettingsIcon
} from 'lucide-react';
import styles from './BottomNav.module.css';
import { useBottomNav } from '../../context/BottomNavContext';

const iconMap: Record<string, React.ReactNode> = {
  careplan: <Crown size={24} />,
  journal: <BookOpen size={24} />,
  companion: <Handshake size={24} />,
  symptoms: <FolderHeart size={24} />,
  trends: <LineChart size={24} />,
  reports: <FileText size={24} />,
  medicalhistory: <BriefcaseMedical size={24} />,
  integrations: <Link2 size={24} />,
  menuscan: <Scan size={24} />,
  analytics: <BarChart2 size={24} />,
  settings: <SettingsIcon size={24} />,
};

const routeMap: Record<string, string> = {
  careplan: '/careplan',
  journal: '/journal',
  companion: '/companion',
  symptoms: '/symptoms',
  trends: '/trends',
  reports: '/reports',
  medicalhistory: '/medicalhistory',
  integrations: '/integrations',
  menuscan: '/menuscan',
  analytics: '/analytics',
  settings: '/settings',
};

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shortcuts } = useBottomNav();

  // Always show Home first
  const navItems = [
    { label: 'My Profile', icon: <Home size={24} />, route: '/' },
    ...shortcuts.map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
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